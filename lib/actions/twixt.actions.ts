"use server";
import { auth } from "@clerk/nextjs";
import Twixt from "../models/twixt.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { useForm } from "react-hook-form";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createTwixt({ text, author, communityId, path }: Params) {
  try {
    connectToDB();
    // const authorObjectId = new mongoose.Types.ObjectId(author);

    const createdTwixt = await Twixt.create({
      text,
      author,
      community: null,
    });
    //update user model
    await User.findByIdAndUpdate(author, {
      $push: { twixts: createdTwixt._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    // throw new Error(`Error creating a post : ${error.message}`);
    throw new Error(`failed to create post : ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  //calculating number of post to skip depending on page we are
  const skipAmount = (pageNumber - 1) * pageSize;

  //fetch posts have no parents
  const postsQuery = Twixt.find({ parentId: { $in: [null, undefined] } })
    .sort({
      createdAt: "desc",
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Twixt.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchTwixtById(id: string) {
  connectToDB();
  try {
    //ToDo : Populate community
    const twixt = await Twixt.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Twixt,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return twixt;
  } catch (error: any) {
    throw new Error(`Error fetching twixt : ${error.message}`);
  }
}
