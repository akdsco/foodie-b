// Imports
import React, { useEffect, useState, useRef } from "react";
// Components
import RestTitle from "./RestTitle";
import RestItemCont from "../containers/RestItemCont";
// Dependencies
import { Accordion } from "semantic-ui-react";

export default function RestItem({
  activeRest,
  handleNewData,
  restaurant,
  windowWidth,
  handleActiveRest,
}) {
  const [scrollFlag, setScrollFlag] = useState(true);
  const restItemRef = useRef(null);
  const { id, avgRating } = restaurant;

  useEffect(() => {
    if (activeRest === -1) {
      setScrollFlag(true);
    }
    if (scrollFlag) {
      if (activeRest === restaurant.id) {
        scrollToItem();
        setScrollFlag(false);
      }
    }
  }, [activeRest, scrollFlag, restaurant.id]);

  function handleAccordionClick(e, titleProps) {
    scrollToItem();
    const { index } = titleProps;
    handleActiveRest(index);
  }

  //TODO change this to use JS Promises and update loading after data is loaded

  function scrollToItem() {
    setTimeout(
      () =>
        restItemRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      220
    );
  }

  return (
    <div ref={restItemRef}>
      <Accordion className="mb-2" styled>
        <Accordion.Title
          active={activeRest === id}
          index={id}
          onClick={handleAccordionClick}
        >
          <RestTitle
            active={activeRest === id}
            restaurant={restaurant}
            avgRating={avgRating}
          />
        </Accordion.Title>
        {activeRest === id && (
          <Accordion.Content active={activeRest === id}>
            <RestItemCont
              restaurant={restaurant}
              windowWidth={windowWidth}
              handleNewData={handleNewData}
            />
          </Accordion.Content>
        )}
      </Accordion>
    </div>
  );
}
