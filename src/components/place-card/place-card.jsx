import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {compose} from 'redux';
import {connect} from 'react-redux';

import {getRatingAsPercentage} from '../../utils/common';
import {housingTypes, CardPlaceClassName} from '../../consts';
import {withBookmarkToggle} from '../../hocs/with-bookmark-toggle/with-bookmark-toggle';
import {getAuthorizationStatusSelector} from '../../store/reducers/user/selectors';
import {changeBookmarkStatus} from '../../store/api-actions';

const PlaceCard = (props) => {
  const {offer, onChangeActiveCard, onMouseOutWithCard, className, onToggleBookmark, isBookmark} = props;
  const {id, isPremium, title, type, price, rating, previewImage} = offer;

  const premiumLabel = (isPremium &&
    <div className="place-card__mark">
      <span>Premium</span>
    </div>);

  const classBookmarkButton = isBookmark ? `place-card__bookmark-button--active` : ``;

  const ratingAsPercentage = getRatingAsPercentage(rating);

  const imageWidth = className === CardPlaceClassName.FAVORITES ? `150` : `260`;
  const imageHeight = className === CardPlaceClassName.FAVORITES ? `110` : `200`;

  return (
    <article
      className={`place-card ${className}__place-card`}
      onMouseOver={() => onChangeActiveCard(id)}
      onMouseOut={() => onMouseOutWithCard()}>

      {className === CardPlaceClassName.FAVORITES ? null : premiumLabel}

      <div className={`${className}__image-wrapper place-card__image-wrapper`}>
        <Link to={`/offer/${id}`}>
          <img className="place-card__image" src={previewImage} width={imageWidth} height={imageHeight} alt="Place image" />
        </Link>
      </div>
      <div className={`${className === CardPlaceClassName.FAVORITES ? `favorites__card-info` : ``} place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            onClick={onToggleBookmark}
            className={`place-card__bookmark-button button ${classBookmarkButton}`}
            type="button">

            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark" />
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${ratingAsPercentage}`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
};

PlaceCard.defaultProps = {
  onChangeActiveCard: () => {},
  onMouseOutWithCard: () => {}
};

PlaceCard.propTypes = {
  offer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.array.isRequired,
    isPremium: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    type: PropTypes.oneOf([...housingTypes]),
    previewImage: PropTypes.string.isRequired,
    reviews: PropTypes.array
  }).isRequired,
  className: PropTypes.oneOf([`cities`, `near-places`, `favorites`]),
  onChangeActiveCard: PropTypes.func,
  onMouseOutWithCard: PropTypes.func,
  onToggleBookmark: PropTypes.func.isRequired,
  isBookmark: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  authorizationStatus: getAuthorizationStatusSelector(state)
});

const mapDispatchToProps = (dispatch) => ({
  toggleBookmarkStatus: (id, value) => {
    dispatch(changeBookmarkStatus(id, value));
  }
});

export {PlaceCard};
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withBookmarkToggle,
    memo
)(PlaceCard);
