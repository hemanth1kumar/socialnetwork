import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";
import Spinner from "../layout/Spinner.component";

function ProfileGithub({ username, getGithubRepos, repos }) {
	useEffect(() => {
		getGithubRepos(username);
	}, [getGithubRepos]);

	return (
		<div className="profile-github">
			<h2 className="text-primary my-1">Github Repos</h2>
			{repos === null || repos === "undefined" ? (
				<Spinner />
			) : (
				repos.map((repo) => (
					<div className="repo bg-white p-1 m-1" key={repo._id}>
						<div className="">
							<h4>
								<a href={repo.html_url} target="_blank" rel="noopener noreferrer ">
									{repo.name}
								</a>
							</h4>
							<p>{repo.description}</p>
						</div>
						<div>
							<ul>
								<li className="badge badge-primary">Stars:{repo.stargazers_count}</li>
								<li className="badge badge-dark">Stars:{repo.watchers_count}</li>
								<li className="badge badge-light">Stars:{repo.forks_count}</li>
							</ul>
						</div>
					</div>
				))
			)}
		</div>
	);
}

ProfileGithub.propTypes = {
	getGithubRepos: PropTypes.func.isRequired,
	repos: PropTypes.array.isRequired,
	username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
