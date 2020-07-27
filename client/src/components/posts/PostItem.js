import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/posts";

const PostItem = ({ post: { _id, text, name, avatar, user, likes, comments, date }, auth, addLike, removeLike, deletePost, showActions }) => (
	<div className="post bg-white p-1 my-1">
		<div>
			<a href="profile.html">
				<img className="round-img" src={avatar} alt="" />
				<h4>{name}</h4>
			</a>
		</div>
		<div>
			<p className="my-1">{text}</p>
			<p className="post-date">
				<Moment format="YYYY/MM/DD">{date}</Moment>
			</p>

			{showActions && (
				<>
					<button type="button" className="btn btn-light" onClick={() => addLike(_id)}>
						<i className="fa fa-thumbs-up" />
						{likes.length > 0 && <span> {likes.length}</span>}
					</button>
					<button type="button" className="btn btn-light" onClick={() => removeLike(_id)}>
						<i className="fa fa-thumbs-down" />
					</button>
					<Link to={`/posts/${_id}`} className="btn btn-primary">
						Discussion {comments.length > 0 && <span className="comment-count">{comments.length}</span>}
					</Link>
					{!auth.loading && user === auth.user._id && (
						<button type="button" className="btn btn-danger" onClick={() => deletePost(_id)}>
							<i className="fa fa-times" />
						</button>
					)}
				</>
			)}
		</div>
	</div>
);

PostItem.defaultProps = {
	showActions: true,
};

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	removeLike: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem);
