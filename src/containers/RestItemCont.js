// Imports
import React, { useEffect, useState } from "react";
// CSS
import "../css/style.css";
// Components
import ReviewItem from "../components/ReviewItem";
import { AddReviewModal, MoreReviews } from "../components/Modals";
import {
  LeftColumnPlaceholder,
  MobilePlaceholder,
  ReviewsPlaceholder,
  RightColumnPlaceholder,
} from "../components/Placeholders";
// Dependencies
import {
  Container,
  Grid,
  GridColumn,
  Icon,
  Image,
  Label,
  Segment,
} from "semantic-ui-react";

const PLACEHOLDER_URL = "https://bit.ly/2JnrFZ6";
const FIREBASE_LOAD_RESTAURANT_MAP =
  "https://us-central1-akds-portfolio.cloudfunctions.net/loadRestaurantStaticMap";
const FIREBASE_LOAD_RESTAURANT_IMAGE =
  "https://us-central1-akds-portfolio.cloudfunctions.net/loadRestaurantImage";

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
  const [reviews, setReviews] = useState("No reviews yet..");
  const [restPhoneNum, setRestPhoneNum] = useState("");
  const [restImage, setRestImage] = useState("");
  const [restWebUrl, setRestWebUrl] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (details) {
      const loadDetails = async () => {
        setReviews(getReviews(details.reviews));
        setRestOpeningTimes(getRestOpeningTimes);
        setRestPhoneNum(details.phoneNumber);
        setRestImage(await getRestPhotoUrl(details.photos));
        setRestWebUrl(details.link);
        setMapUrl(await getGoogleMapStaticUrl(restaurant));
        setTimeout(() => {
          setLoadingData(false);
        }, 500);
      };
      loadDetails().then(() => console.log("Restaurant details data loaded.."));
    }
  }, [details, isFromFile]);

  /* =============================
   *   Content Loading Functions
  _* =============================
*/

  const getRestOpeningTimes = () => {
    let openingTimes;
    if (details.openingHours && !isFromFile) {
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

  const getRestPhotoUrl = (photosArray) => {
    if (!isFromFile) {
      return new Promise((resolve) => {
        fetch(FIREBASE_LOAD_RESTAURANT_IMAGE, {
          method: "POST",
          body: JSON.stringify({
            photosArray: photosArray,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            const { restPhotoUrl } = JSON.parse(data.body);
            resolve(restPhotoUrl);
          })
          .catch((err) => {
            console.log("Error when fetching from Google API: ", err);
          });
      });
    } else {
      return PLACEHOLDER_URL;
    }
  };

  const getGoogleMapStaticUrl = (restaurant) => {
    return new Promise((resolve) => {
      fetch(FIREBASE_LOAD_RESTAURANT_MAP, {
        method: "POST",
        body: JSON.stringify({
          restaurant: restaurant,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const { restMapUrl } = JSON.parse(data.body);
          resolve(restMapUrl);
        })
        .catch((err) => {
          console.log("Error when fetching from Google API: ", err);
        });
    });
  };

  const getReviews = (reviews) => {
    return reviews.map((review, id) => (
      <Grid key={id}>
        <Grid.Row centered>
          <GridColumn width={15}>
            <ReviewItem item={review} fromFile={isFromFile} />
          </GridColumn>
        </Grid.Row>
      </Grid>
    ));
  };

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
                    href={restWebUrl}
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
                <Image src={restImage} fluid />
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
                    href={restWebUrl}
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
              <Image src={mapUrl} fluid />
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
                <h3>Most recent reviews</h3>
                {reviews}
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
                photoUrl={restImage}
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
