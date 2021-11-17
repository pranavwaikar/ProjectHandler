import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const renderRepoData = (error, repos) => {
  if (error.status) {
    return (
      <p> Because of rate limiting from github we are not able to fetch! </p>
    );
  } else {
    if (repos.length === 0 && error.status === undefined) {
      return <Spinner />;
    } else {
      return (
        <Fragment>
          {repos.map((repo) => (
            <div key={repo._id} className="repo bg-white p-1 my-1">
              <div>
                <h4>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.name}
                  </a>
                </h4>
                <p>{repo.description}</p>
              </div>
              <div>
                <ul>
                  <li className="badge badge-primary">
                    Stars: {repo.stargazers_count}
                  </li>
                  <li className="badge badge-dark">
                    Watchers: {repo.watchers_count}
                  </li>
                  <li className="badge badge-light">
                    Forks: {repo.forks_count}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </Fragment>
      );
    }
  }
};

const ProfileGithub = ({ username, getGithubRepos, repos, error }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [username, getGithubRepos]);

  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">
        <i className="fab fa-github"></i> Github Repos
      </h2>
      {renderRepoData(error, repos)}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
  error: state.profile.error,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
