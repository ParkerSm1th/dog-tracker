import {
  useAuth,
} from '@clerk/clerk-expo';
import type {
  User,
} from '@common/models';
import {
  useQueryClient,
} from '@tanstack/react-query';
import {
  useAuthMutation,
  useAuthQuery,
} from './useAuthHooks';

export const useCurrentUser = () => {
  const { userId } = useAuth();
  const { data, ...rest } = useAuthQuery({
    queryKey: ['users', userId],
    authQueryFn: (api) => api.get('users/info').json<User>(),
  });

  return { user: data, ...rest };
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return useAuthMutation({
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', userId],
      });
    },
    authMutationFn: (api, variables) =>
      api.post('users', {
        body: JSON.stringify(variables),
      }).json<User>(),
  });
};
