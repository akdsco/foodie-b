// Imports
import React, { useState, useEffect } from "react";
// Images
import foodPlate from "../img/food-plate.jpg";
// CSS
import "../css/style.css";
// Components
import { AvgRatingComponent } from "./RatingComponents";
// Dependencies
import { Button, Icon, Item } from "semantic-ui-react";

export default function RestTitle({ avgRating, active, restaurant }) {
  const { restaurantName, thumb_photo_url, details, address } = restaurant;
  const [photo, setPhoto] = useState(foodPlate);

  useEffect(() => {
    if (thumb_photo_url) {
      setPhoto(thumb_photo_url);
    } else {
      setPhoto(details.photoUrl);
    }
  }, [setPhoto, thumb_photo_url]);

  return (
    <Item>
      <div
        style={{
          float: "left",
          marginRight: 8,
          height: 60,
          width: 80,
          backgroundSize: "cover",
          backgroundImage: `url(${photo})`,
        }}
      />
      <Item.Content>
        <Item.Header as="a">{restaurantName}</Item.Header>
        <Item.Meta>
          <span className="restaurant">{address}</span>
        </Item.Meta>
        <Item.Extra>
          <AvgRatingComponent avgRating={avgRating} />
          <Button className="more-info" size="mini" floated="right">
            {active ? "Less" : "More Info"}
            <Icon name="dropdown" />
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
}
