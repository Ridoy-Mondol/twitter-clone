import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { RxDotsHorizontal } from "react-icons/rx";
import { Avatar, Menu, MenuItem, TextField } from "@mui/material";
import { AiFillTwitterCircle } from "react-icons/ai";

import { TweetProps } from "@/types/TweetProps";
import { formatDateExtended } from "@/utilities/date";
import Reply from "./Reply";
import Retweet from "./Retweet";
import Like from "./Like";
import Share from "./Share";
import Counters from "./Counters";
import { getFullURL } from "@/utilities/misc/getFullURL";
import { VerifiedToken } from "@/types/TokenProps";
import { deleteTweet, updateTweet } from "@/utilities/fetch";
import PreviewDialog from "../dialog/PreviewDialog";
import { shimmer } from "@/utilities/misc/shimmer";
import NewReply from "./NewReply";
import Replies from "./Replies";
import CustomSnackbar from "../misc/CustomSnackbar";
import { SnackbarProps } from "@/types/SnackbarProps";
import CircularLoading from "../misc/CircularLoading";
import { sleepFunction } from "@/utilities/misc/sleep";

import { useFormik } from "formik";
import * as yup from "yup";
import { json } from "stream/consumers";
import ProgressCircle from "../misc/ProgressCircle";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { FaRegSmile } from "react-icons/fa";

export default function SingleTweet({ tweet, token }: { tweet: TweetProps; token: VerifiedToken }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [count, setCount] = useState(0);
    const [showPicker, setShowPicker] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({ message: "", severity: "success", open: false });

    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (jsonId: string) => deleteTweet(tweet.id, tweet.authorId, jsonId),
        onSuccess: async () => {
            setIsConfirmationOpen(false);
            setIsDeleting(false);
            setSnackbar({
                message: "Tweet deleted successfully. Redirecting to the profile page...",
                severity: "success",
                open: true,
            });
            await sleepFunction();
            queryClient.invalidateQueries(["tweets", tweet.author.username]);
            router.replace(`/${tweet.author.username}`);
        },
        onError: (error) => console.log(error),
    });

    const updateMutation = useMutation({
        mutationFn: (updatedTweetData: { text: string; authorId: string }) => updateTweet(tweet.id, JSON.stringify(token?.id), updatedTweetData),
        onSuccess: () => {
            queryClient.invalidateQueries(["tweets", tweet.author.username]);
            setSnackbar({
                message: "Tweet updated successfully.",
                severity: "success",
                open: true,
            });
        },
        onError: (error) => console.error(error),
    });

    const handleAnchorClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleAnchorClose = () => {
        setAnchorEl(null);
    };
    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handlePreviewClick();
    };
    const handlePreviewClick = () => {
        setIsPreviewOpen(true);
    };
    const handlePreviewClose = () => {
        setIsPreviewOpen(false);
    };
    const handleConfirmationClick = () => {
        handleAnchorClose();
        setIsConfirmationOpen(true);
    };

    const handleDelete = async () => {
        if (!token) {
            return setSnackbar({
                message: "You must be logged in to delete tweets...",
                severity: "info",
                open: true,
            });
        }
        handleAnchorClose();
        setIsDeleting(true);
        const jsonId = JSON.stringify(token.id);
        mutation.mutate(jsonId);
    };

    const validationSchema = yup.object({
        text: yup
            .string()
            .max(280, "Tweet text should be of maximum 280 characters length.")
            .required("Tweet text can't be empty."),
    });

    const formik = useFormik({
        initialValues: {
            text: tweet.text,
            authorId: tweet.authorId,
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setIsUpdating(true);
                console.log('val',values);
                await updateMutation.mutateAsync(values);
                resetForm();
                setIsUpdateOpen(false);
            } catch (error) {
                console.error("Failed to update tweet:", error);
            } finally {
                setIsUpdating(false);
            }
        },
    });
    
    const customHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCount(e.target.value.length);
        formik.handleChange(e);
    };

    if (formik.isSubmitting) {
        return <CircularLoading />;
    }

    return (
        <div>
            <div className={`single-tweet tweet ${tweet.isReply && "reply"}`}>
                <div className="single-tweet-author-section">
                    <div>
                        <Link className="tweet-avatar" href={`/${tweet.author.username}`}>
                            <Avatar
                                className="avatar"
                                sx={{ width: 50, height: 50 }}
                                alt=""
                                src={tweet.author.photoUrl ? getFullURL(tweet.author.photoUrl) : "/assets/egg.jpg"}
                            />
                        </Link>
                    </div>
                    <div className="tweet-author-section">
                        <Link className="tweet-author-link" href={`/${tweet.author.username}`}>
                            <span className="tweet-author">
                                {tweet.author.name !== "" ? tweet.author.name : tweet.author.username}
                                {tweet.author.isPremium && (
                                    <span className="blue-tick" data-blue="Verified Blue">
                                        <AiFillTwitterCircle />
                                    </span>
                                )}
                            </span>
                            <span className="text-muted">@{tweet.author.username}</span>
                        </Link>
                        {token && token.username === tweet.author.username && (
                            <>
                                <button className="three-dots icon-hoverable" onClick={handleAnchorClick}>
                                    <RxDotsHorizontal />
                                </button>
                                <Menu anchorEl={anchorEl} onClose={handleAnchorClose} open={Boolean(anchorEl)}>
                                    <MenuItem onClick={handleConfirmationClick} className="delete">
                                        Delete
                                    </MenuItem>
                                    <MenuItem className="delete" onClick={()=> setIsUpdateOpen(true)}>
                                        Update
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </div>
                </div>
                <div className="tweet-main">
                    <div className="tweet-text">
                        {tweet.isReply && (
                            <Link href={`/${tweet.repliedTo.author.username}`} className="reply-to">
                                <span className="mention">@{tweet.repliedTo.author.username}</span>
                            </Link>
                        )}{" "}
                        {tweet.text}
                    </div>
                    {tweet.photoUrl && (
                        <>
                            <div className="tweet-image">
                                <Image
                                    onClick={handleImageClick}
                                    src={getFullURL(tweet.photoUrl)}
                                    alt="tweet image"
                                    placeholder="blur"
                                    blurDataURL={shimmer(500, 500)}
                                    height={500}
                                    width={500}
                                />
                            </div>
                            <PreviewDialog
                                open={isPreviewOpen}
                                handlePreviewClose={handlePreviewClose}
                                url={tweet.photoUrl}
                            />
                        </>
                    )}
                    <span className="text-muted date">{formatDateExtended(tweet.createdAt)}</span>
                    <Counters tweet={tweet} />
                    <div className="tweet-bottom">
                        <Reply tweet={tweet} />
                        <Retweet tweetId={tweet.id} tweetAuthor={tweet.author.username} />
                        <Like tweetId={tweet.id} tweetAuthor={tweet.author.username} />
                        <Share
                            tweetUrl={`https://${window.location.hostname}/${tweet.author.username}/tweets/${tweet.id}`}
                        />
                    </div>
                </div>
            </div>
            {token && <NewReply token={token} tweet={tweet} />}
            {tweet.replies.length > 0 && <Replies tweetId={tweet.id} tweetAuthor={tweet.author.username} />}
            {snackbar.open && (
                <CustomSnackbar message={snackbar.message} severity={snackbar.severity} setSnackbar={setSnackbar} />
            )}

            {/* Delete Tweet */}
            {isConfirmationOpen && (
                <div className="html-modal-wrapper">
                    <dialog open className="confirm">
                        <h1>Delete Tweet?</h1>
                        <p>
                            This can’t be undone and it will be removed from your profile, the timeline of any accounts that
                            follow you, and from Twitter search results.
                        </p>
                        {isDeleting ? (
                            <CircularLoading />
                        ) : (
                            <>
                                <button className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>
                                <button className="btn btn-white" onClick={() => setIsConfirmationOpen(false)}>
                                    Cancel
                                </button>
                            </>
                        )}
                    </dialog>
                </div>
            )}
            

        {/* Update Tweet */}
       {isUpdateOpen && (
        <div className="html-modal-wrapper">
        <dialog open className="new-tweet-form" onClick={(e) => e.stopPropagation()}>
            <Avatar
                className="avatar div-link"
                sx={{ width: 50, height: 50 }}
                alt=""
                src={token?.photoUrl ? getFullURL(token?.photoUrl) : "/assets/egg.jpg"}
            />
            <form onSubmit={formik.handleSubmit}>
                <div className="input">
                    <TextField
                        placeholder="Update your tweet..."
                        multiline
                        hiddenLabel
                        minRows={3}
                        variant="standard"
                        fullWidth
                        name="text"
                        value={formik.values.text}
                        onChange={customHandleChange}
                        error={formik.touched.text && Boolean(formik.errors.text)}
                        helperText={formik.touched.text && formik.errors.text}
                    />
                </div>
                <div className="input-additions">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setShowPicker(!showPicker);
                        }}
                        className="icon-hoverable"
                    >
                        <FaRegSmile />
                    </button>
                    <ProgressCircle maxChars={280} count={formik.values.text.length} />
                    <button
                        className={`btn ${formik.isValid ? "" : "disabled"}`}
                        disabled={!formik.isValid || isUpdating}
                        type="submit"
                    >
                        {isUpdating ? "Updating..." : "Save"}
                    </button>
                    <button
                        className="btn btn-white"
                        type="button"
                        onClick={() => setIsUpdateOpen(false)}
                    >
                        Close
                    </button>
                </div>
                {/* Emoji Picker Component */}
                {showPicker && (
                    <div className="emoji-picker">
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji: any) => {
                                formik.setFieldValue("text", formik.values.text + emoji.native);
                                setShowPicker(false);
                                setCount(formik.values.text.length + emoji.native.length);
                            }}
                            previewPosition="none"
                        />
                    </div>
                )}
             </form>
           </dialog>
         </div>
        )}




        </div>
    );
}




