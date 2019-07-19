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
            <Grid>
              <Grid.Row centered columns={2} only='computer'>
                <GridColumn width={7}>
                  <RestaurantItem />
                </GridColumn>
                <GridColumn width={7}>
                  <Map />
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='tablet'>
                <GridColumn>
                  <Map />
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='mobile'>
                <GridColumn>
                  <Map />
                </GridColumn>
              </Grid.Row>
            </Grid>
        </div>
    );
  }
}

export default App;