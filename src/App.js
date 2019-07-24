// Import CSS
import './css/App.css';

// Import Components
import React from 'react';
import Map from "./components/Map";
import DataDisplay from './components/DataDisplay';
import Container from "semantic-ui-react/dist/commonjs/elements/Container";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";

class App extends React.Component {
  render() {
    return (
        <div>
          <Container>
            <Grid>
              <Grid.Row centered columns={2} only='computer'>
                <GridColumn width={8} >
                  <DataDisplay />
                </GridColumn>
                <GridColumn width={8}>
                  <Map />
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='tablet'>
                <GridColumn>
                  {/*<Map />*/}
                </GridColumn>
              </Grid.Row>
              <Grid.Row centered columns={1} only='mobile'>
                <GridColumn>
                  <Map />
                </GridColumn>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
    );
  }
}

export default App;