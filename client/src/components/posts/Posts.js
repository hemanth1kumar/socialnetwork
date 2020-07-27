import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions/posts";
import Spinner from "../layout/Spinner.component";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Posts = ({ getPosts, post: { posts, loading } }) => {
	useEffect(() => {
		getPosts();
	}, [getPosts]);

	return loading ? (
		<Spinner />
	) : (
		<>
			<h1 className="large text-primary">Posts</h1>
			<p className="lead">
				<i className="fa fa-user"></i> Welcome to the community
			</p>
			{/* Post Form */}
			<PostForm />
			<div className="posts">
				{posts.map((post) => (
					<PostItem post={post} key={post._id} />
				))}
			</div>
		</>
	);
};

Posts.propTypes = {
	posts: PropTypes.array.isRequired,
	getPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
