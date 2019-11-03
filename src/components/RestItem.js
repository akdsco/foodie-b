// Imports
import React from 'react';
// Components
import RestTitle from "./RestTitle";
import RestItemCont from "./RestItemCont";
// Dependencies
import Accordion from "semantic-ui-react/dist/commonjs/modules/Accordion";

export default class RestItem extends React.Component {
  constructor(props) {
    super(props);
    this.reference = React.createRef();
    this.scrollFlag = true;
  }

  /* =====================
   *   Lifecycle Methods
  _* =====================
*/

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { activeRest, restaurant } = this.props;

    // Scrolls only once after opening up Accordion, then it doesn't until you close and open it again.
    if(activeRest === -1) {
      this.scrollFlag = true;
    }
    if(this.scrollFlag) {
      if(activeRest === restaurant.id) {
        this.scrollToItem();
        this.scrollFlag = false;
      }
    }

  }

  /* ===================
   *   Handler Methods
  _* ===================
*/

  handleAccordionClick = (e, titleProps) =>  {
    this.scrollToItem();
    const { index } = titleProps;
    this.props.handleActiveRest(index);
  };

  /* ==================
   *   Custom Methods
  _* ==================
*/

  scrollToItem = () => {
    setTimeout(() =>
    this.reference.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    }), 220);
  };



  render() {
    const { activeRest, handleNewData, restaurant, windowWidth } = this.props;
    const { reference, handleAccordionClick } = this;

    return(
      <div ref={reference}>
        <Accordion className='mb-2' styled>
          <Accordion.Title
            active={activeRest === restaurant.id}
            index={restaurant.id}
            onClick={handleAccordionClick}>
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