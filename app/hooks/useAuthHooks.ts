import {
  useAuth,
} from '@clerk/clerk-expo';
import type {
  MutationOptions,
  QueryFunctionContext,
  QueryKey,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import ky from 'ky';

export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL,
});

export type Api = typeof api;
export type GetToken = ({
  template,
}: {
  template: string;
}) => Promise<string | null>;

const createAuthApi = async (tokenGetter: GetToken) => {
  const token = await tokenGetter({ template: 'long-lasting' });
  if (!token) { throw new Error('User is not signed in'); }
  return api.extend({
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

type AuthQueryFunction<
  T = unknown,
  TQueryKey extends QueryKey = QueryKey,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TPageParam = any,
> = (api: Api, context: QueryFunctionContext<TQueryKey, TPageParam>) => T | Promise<T>;

export function useAuthQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  authQueryFn,
  ...options
}: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
  authQueryFn: AuthQueryFunction<TQueryFnData, TQueryKey, unknown>;
}): UseQueryResult<TData, TError> {
  const { getToken } = useAuth();
  return useQuery({
    ...options,
    queryFn: async (args) => {
      const api = await createAuthApi(getToken);

      // I pass the created api with the auth header already setup to the caller
      // @ts-expect-error -- I don't know how to fix this
      return authQueryFn(api, args);
    },
  });
}

type AuthMutationFunction<
  TData = unknown,
  TVariables = unknown,
> = (api: Api, variables: TVariables) => Promise<TData>;

export function useAuthMutation<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
>({
  authMutationFn,
  ...options
}: MutationOptions<TData, TError, TVariables, QueryKey> & {
  authMutationFn: AuthMutationFunction<TData, TVariables>;
}): UseMutationResult<TData, TError, TVariables> {
  const { getToken } = useAuth();

  return useMutation({
    ...options,
    mutationFn: async (variables: TVariables) => {
      const api = await createAuthApi(getToken);
      return authMutationFn(api, variables);
    },
  });
}
