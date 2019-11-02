import React from 'react';
import RestTitle from "./RestTitle";
import RestItemCont from "./RestItemCont";
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";

export default class RestItem extends React.Component {
  constructor(props) {
    super(props);
    this.reference = React.createRef();
    this.scrollFlag = true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Scrolls only once after opening up Accordion, then it doesn't until you close and open it again.
    if(this.scrollFlag) {
      if(this.props.activeRest === this.props.restaurant.id) {
        this.scrollToItem();
        this.scrollFlag = false;
      }
    }
  }

  scrollToItem = () => {
    setTimeout(() =>
    this.reference.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    }), 220);
  };

  handleAccordionClick = (e, titleProps) =>  {
    this.scrollToItem();
    const { index } = titleProps;
    this.props.handleActiveRest(index);
  };

  render() {
    const { activeRest, handleNewData, restaurant, windowWidth } = this.props;

    return(
      <div ref={this.reference}>
        <Accordion className='mb-2' styled>
          <Accordion.Title
            active={activeRest === restaurant.id}
            index={restaurant.id}
            onClick={this.handleAccordionClick}>
            <RestTitle
              active={activeRest === restaurant.id}
              item={restaurant}
              avgRating={restaurant.avgRating}
            />
          </Accordion.Title>
          {activeRest === restaurant.id &&
          <Accordion.Content active={activeRest === restaurant.id}>
            <RestItemCont
              restaurant={restaurant}
              windowWidth={windowWidth}
              handleNewData={handleNewData}
            />
          </Accordion.Content>
          }
        </Accordion>
      </div>
    )
  }
}