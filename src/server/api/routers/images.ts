import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "~/server/db";
import { env } from "~/env";

const createPresignedPostSchema = z.object({
  name: z.string(),
});

export const imagessRouter = createTRPCRouter({
  // create: adminProcedure.query(({ ctx }) => {
  createPresignedPost: publicProcedure
    .input(createPresignedPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { imageId } = input;
      const { url } = await createPresignedPost(s3Client, {
        Bucket: env.BUCKET_NAME,
        Key: name,
        Conditions: [
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, 1000000],
        ],
        Fields: {
          key: name,
        },
        Expires: 30,
      });

      return null;
    }),
});
