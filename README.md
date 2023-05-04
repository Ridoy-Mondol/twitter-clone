# Twitter Clone

## Roadmap

-   [x] add hash to passwords when creating
-   [x] add auth
-   [x] if auth, return to /home | /explore
-   [x] add regex validation to usernames / yup docs
-   [x] list tweets as last tweeted first
-   [x] add a static @ into username in login and sign up
-   [x] if name is not provided, get username in prisma schema
-   [x] refactor sign up and sign in forms
-   [x] break-word for description
-   [x] add env.example
-   [x] add modal for logout
-   [x] think about test account
-   [x] global loading
-   [x] add global loading as twitter bird with animation
-   [x] tweak useAuth, add loading state for auth loading instead of null
-   [x] optimistic update on likes
-   [x] unlike feature
-   [x] animation on click ? react spring/framer
-   [x] div onClick and cursor pointer for tweets
-   [x] useContext in useAuth?
-   [x] fix the logout sometimes not working as expected
-   [x] authorization wall for create/like/unlike
-   [x] fix middleware, make it useful
-   [x] handle tweet text html-like breaks
-   [x] emote picker in new tweet
-   [x] photo upload in new tweet
-   [x] more compact uploader for photo upload,
-   [x] supabase storage is ok to use for avatars and images? if not use aws
-   [x] clicking images should open full screen images
-   [x] avatar logic
-   [x] handle default avatar / twitter egg
-   [x] fix emoji not opening in the modal
-   [x] complete media link in profile
-   [x] follow/unfollow feature
-   [x] optimistic update on follow/unfollow
-   [x] lazy load tweets / react query implementation for lazy loading
-   [x] add is following you feature
-   [x] complete edit profile page
-   [x] fix url for photos (only short url exist for now, will give error)
-   [x] profile pic, header pic change in profile
-   [x] cascade in postgresql / how to handle deleted tweets
-   [x] refactor uploader in new tweet to prevent unnecessary uploads to the server, only upload if user tweets
-   [x] add delete options for users tweets
-   [x] handle tweet not found error
-   [x] handle user not found error
-   [x] authorization wall for delete/follow/unfollow/edit
-   [x] add retweet feature
-   [x] single tweet page refactor with images
-   [x] header and profile picture click fullscreen preview
-   [x] show retweets in the main flood
-   [x] add reply feature
-   [x] single tweet page shows all replies or only first degree replies?
-   [x] console log every useQuery to find out if any password leaking
-   [x] exlude password in prisma includes:{}, fix types and what includes for all api routes
-   [x] handle errors like "user already exists"
-   [x] add card when hover on tweet profile & username & who retweeted & mentioned
-   [x] complete profile, remove placeholders, desc images and everything
-   [x] think about handling related errors in the fetch folder
-   [x] add global-error.tsx
-   [x] use "use client" if possible
-   [x] change all request type to nextRequest
-   [x] organize overall code/folders
-   [ ] autofocus in modals
-   [ ] change explore to home, home only followings
-   [ ] make settings public, home private
-   [ ] start working on right sidebar
-   [ ] search mechanism, only for users / users and tweets would be better
-   [ ] useDeferredValue for search if react query has not have it
-   [ ] add snackbar for some feedback, copy from twitter
-   [ ] try html dialog for confirmations
-   [ ] find throw new Errors, console.logs, message:, error:, snackbar here, alert(), confirm(),
-   [ ] handle home/edit explore/edit and this kind of paths, redirect if requested. or catch all method
-   [ ] progress bar for 280 characters
-   [ ] animations on tweets
-   [ ] hover effect on avatars
-   [ ] custom scrollbar
-   [ ] header photo with twitter bird
-   [ ] tooltips for likes/retweets and so on
-   [ ] mutual connections feature in profile
-   [ ] add a bar under the avatar if the tweet replies > 0
-   [ ] add twitter blue tick in edit profile
-   [ ] if auth, show random non-followed 3 people with avatars and has more than 1 followers for user to follow in right side
-   [ ] change localhost to env or however next handles this
-   [ ] message logic / socket io? feathers? how in next
-   [ ] handle users trying to message themselves
-   [ ] add a most basic chatbot to show off messaging feature / chatbase.co
-   [ ] how to add notifications? if really complex, hang it for later
-   [ ] get auto follower 1 profile after user creates, seeing a notification after creating might bee cool
-   [ ] welcome notification at least
-   [ ] make it responsive
-   [ ] handle mui components' css better, using sx:{} while making it responsive
-   [ ] add dark mode
-   [ ] material ui custom colors
-   [ ] block/unblock feature (optional, maybe in roadmap?)
-   [ ] add hidden/locked profile, deal with temp keyword in search (optional, maybe in roadmap?)
-   [ ] find out how to infinite load for every page / extract usememo to the different component? because can't conditionaly render
-   [ ] find a better way to delete tweets other than window.location.replace()
-   [ ] delete all users and tweets before deploying, make it more presentable and maybe use faker.js
-   [ ] if after deploy still slow, get info from user query, clean up tweet responses
-   [ ] choose database and vercel serverless locations close
-   [ ] create changelog md
