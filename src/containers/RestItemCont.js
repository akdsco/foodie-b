// Imports
import React, { useEffect, useState } from "react";
// CSS
import "../css/style.css";
// Components
import ReviewItem from "../components/ReviewItem";
import { AddReviewModal, MoreReviews } from "../components/Modals";
import {
  LeftColumnPlaceholder,
  RightColumnPlaceholder,
  ReviewsPlaceholder,
  MobilePlaceholder,
} from "../components/Placeholders";
// Dependencies
import {
  Container,
  GridColumn,
  Grid,
  Image,
  Icon,
  Segment,
  Label,
} from "semantic-ui-react";

const PLACEHOLDER_URL = "https://bit.ly/2JnrFZ6";

const genericOpeningTimes = [
  <p key={0} className="mb-2">
    Mon: 11am - 10pm
  </p>,
  <p key={1} className="mb-2">
    Tue: 11am - 10pm
  </p>,
  <p key={2} className="mb-2">
    Wed: 11am - 10pm
  </p>,
  <p key={3} className="mb-2">
    Thu: 11am - 10pm
  </p>,
  <p key={4} className="mb-2">
    Fri: 11am - 10pm
  </p>,
  <p key={5} className="mb-2">
    Sat: 11am - 10pm
  </p>,
  <p key={6} className="mb-2">
    Sun: 11am - 10pm
  </p>,
];

//TODO firebase cloud function to get data from GoogleMaps API -> Change in this file needed

export default function RestItemCont({
  restaurant,
  handleNewData,
  windowWidth,
}) {
  const [loadingData, setLoadingData] = useState(true);
  const { details, isFromFile, open } = restaurant;
  const [restOpeningTimes, setRestOpeningTimes] = useState(genericOpeningTimes);
  const [restPhoneNum, setRestPhoneNum] = useState("");

  useEffect(() => {
    if (details && !isFromFile) {
      setRestOpeningTimes(getRestOpeningTimes);
      setRestPhoneNum(details.phoneNumber);
      setTimeout(() => {
        setLoadingData(false);
      }, 500);
    }
  }, [details, isFromFile]);

  /* =============================
   *   Content Loading Functions
  _* =============================
*/

  const getRestOpeningTimes = () => {
    let openingTimes;
    if (details.openingHours) {
      openingTimes = details.openingHours.weekday_text.map((day, index) => (
        <p key={index} className="mb-2">
          {day}
        </p>
      ));
    } else {
      openingTimes = genericOpeningTimes;
    }
    return openingTimes;
  };

  function getRestPhotoUrl() {
    let url = PLACEHOLDER_URL;

    if (details && details.photos) {
      let photoRef = details.photos[1]
        ? details.photos[1].photo_reference
        : details.photos[0]
        ? details.photos[0].photo_reference
        : "";
      url =
        `https://maps.googleapis.com/maps/api/place/photo?` +
        `maxwidth=800` +
        `&photoreference=${photoRef}` +
        `&key=`;
    } else if (
      typeof details.photoUrl !== "undefined" &&
      details.photoUrl !== ""
    ) {
      url = details.photoUrl;
    }
    return url;
  }

  function getGoogleMapStaticUrl() {
    return (
      `https://maps.googleapis.com/maps/api/staticmap?` +
      `center=${restaurant.lat},${restaurant.lng}` +
      `&zoom=16` +
      `&size=640x480` +
      `&markers=color:red%7Clabel:Bronco%7C${restaurant.lat},${restaurant.lng}` +
      `&key=`
    );
  }

  return (
    <Container className="rest-item-cont">
      <Grid className="margin-zero">
        {/* Restaurant information */}

        <Grid.Row columns={2} only="computer tablet">
          <GridColumn width={7}>
            {/*  Left Column - Data  */}
            {loadingData ? (
              <LeftColumnPlaceholder />
            ) : (
              <div>
                <div key={0} className="mb-1">
                  <Icon name="phone" />
                  <a href={"tel:" + restPhoneNum}>{restPhoneNum}</a>
                </div>
                <div key={1} className="mb-2">
                  <Icon name="linkify" />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={details && details.link}
                  >
                    Visit Website
                  </a>
                </div>
                <div key={2}>
                  <h4 className="mb-2">Opening Times</h4> {restOpeningTimes}
                </div>
              </div>
            )}
          </GridColumn>
          <GridColumn width={9}>
            {/*Right Column - Photo */}
            {loadingData ? (
              <Segment>
                <RightColumnPlaceholder />
              </Segment>
            ) : (
              <div>
                <Image src={details && getRestPhotoUrl()} fluid />
              </div>
            )}
          </GridColumn>
        </Grid.Row>

        {/* Restaurant information - Mobile Screens */}

        {windowWidth < 768 && loadingData ? (
          <MobilePlaceholder />
        ) : (
          <Grid.Row columns={2} only="mobile">
            <GridColumn width={11}>
              <div className="my-2">
                <div className="display-inline">
                  <Icon name="phone" />
                  <a className="mr-2" href={"tel:" + restPhoneNum}>
                    {restPhoneNum}
                  </a>
                </div>
                <div className="display-inline">
                  <Icon name="linkify" />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={details && details.link}
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </GridColumn>
            <GridColumn width={5} textAlign="center">
              <div className="my-2">
                <Label tag color={open ? "green" : "red"} size="tiny">
                  {open ? "Open Now" : "Closed"}
                </Label>
              </div>
            </GridColumn>
            <GridColumn width={16}>
              <Image src={getGoogleMapStaticUrl()} fluid />
            </GridColumn>
          </Grid.Row>
        )}

        {/* Reviews */}

        <Grid.Row>
          <GridColumn>
            {loadingData ? (
              <ReviewsPlaceholder
                amount={isFromFile ? details.reviews.length : 5}
              />
            ) : (
              <div>
                <h3>Most helpful reviews</h3>
                {details &&
                  details.reviews.map((review, id) => {
                    return (
                      <Grid key={id}>
                        <Grid.Row centered>
                          <GridColumn width={15}>
                            <ReviewItem item={review} fromFile={isFromFile} />
                          </GridColumn>
                        </Grid.Row>
                      </Grid>
                    );
                  })}
              </div>
            )}
          </GridColumn>
        </Grid.Row>

        {/* More Reviews and Add Review Modals */}

        <Grid.Row>
          <GridColumn className="rest-item-buttons">
            {details && <MoreReviews />}
            {details && (
              <AddReviewModal
                photoUrl={getRestPhotoUrl()}
                restaurant={restaurant}
                handleNewData={handleNewData}
              />
            )}
          </GridColumn>
        </Grid.Row>
      </Grid>
    </Container>
  );
}
