import { useToast } from "@/hooks/use-toast";

import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment, submitComment } from "./actions";
import { CommentsPage } from "@/lib/types";

export const useSubmitCommentMutation = (postId: string) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate: (query) => {
          return !query.state.data;
        },
      });

      toast({
        description: "Your comment has been created",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to create comment, please try again.",
      });
    },
  });

  return mutation;
};

export const useDeleteCommentMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deleteComment) => {
      const queryKey: QueryKey = ["comments", deleteComment.postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter((c) => c.id !== deleteComment.id),
            })),
          };
        },
      );

      toast({
        description: "Your comment has been deleted",
      });
    },
    onError: (error) => {
      console.error(error);

      toast({
        variant: "destructive",
        description: "Failed to delete comment, please try again.",
      });
    },
  });

  return mutation;
};
