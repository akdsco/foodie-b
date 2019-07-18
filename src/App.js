import React from 'react';
import './App.css';
import Map from "./Map";
import RestaurantItem from './RestaurantItem';
import MySidebar from "./Sidebar";
import {Header, Icon, Image, Menu, Segment, Sidebar} from "semantic-ui-react";
import {Marker} from "react-google-maps";
import Container from "semantic-ui-react/dist/commonjs/elements/Container";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";

class App extends React.Component {
  render() {
    return (
        <div>
          <Container>
            <Grid>
              <Grid.Row>
                  <GridColumn width={8}>
                    <RestaurantItem />
                  </GridColumn>
                  <GridColumn width={8}>
                    {/*<Map />*/}
                  </GridColumn>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
    );
  }
}

export default App;