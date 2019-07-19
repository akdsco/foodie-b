import React from 'react'
import {Button, Header, Icon, Image, Modal} from 'semantic-ui-react'
import ReviewItem from "./ReviewItem";
import ItemGroup from "semantic-ui-react/dist/commonjs/views/Item/ItemGroup";
import RatingComponent from "./RatingComponent";

const ReviewsJSON = [
  {
    childKey: 0,
    header: 'Paulo Manion',
    description: 'Food was good but not the best.',
    extra: <RatingComponent />,
  },
  {
    childKey: 1,
    header: 'David Silva',
    description: 'Amazing experience, staff made it a superb visit.',
    extra: <RatingComponent />,
  },
]

const Reviews = () => (
    <Modal trigger={<Button size='tiny' floated='right'>Reviews <Icon name='dropdown' /></Button>}>
      <Modal.Header>Farmer J - Reviews</Modal.Header>
      <Modal.Content image>
        <Image wrapped size='medium' src='./fmj.jpg' />
        <Modal.Description>
          <Header>What People say about Farmer J</Header>
          <ItemGroup link items={ReviewsJSON} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
)

export default Reviews
