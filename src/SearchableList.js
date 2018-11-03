import React, { Component } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';

class FlatListTaxi extends Component {

  constructor(props) {
    super(props);

    this.state = {
      seed: 1,
      page: 1,
      data: [],
      error: null,
      isLoading: false,
      isRefreshing: false,
    };
  }

  //up
  handleRefresh = () => {
    this.setState({
        seed: this.state.seed + 1,
        isRefreshing: true,
    }, () => {
        this.makeRemoteRequest();
    });
  };

  //down
  handleLoadMore = () => {
    this.setState({
        page: this.state.page + 1
    }, () => {
        this.makeRemoteRequest();
    });
  };


  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { data, page, seed } = this.state;
    const url = `https://jsonplaceholder.typicode.com/users/?seed=${seed}&page=${page}&results=30`;
    
    //const url = `http://`;  URL на данные в JSON
    
    //При ограничении результатов со стороны сервера убрать константу над URL и в 'this.state' поменять местами коменты 'data'

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res : [...data, ...res],
          //data: res,
          error: res.error || null,
          isRefreshing: false,
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({ error, isRefreshing: false });
      });
  };

  renderSeparator = () => {
    return (
      <View style={styles.separator} />
    );
  };

  renderHeader = () => {
    return (
      <Button
        title="RELOAD"
        titleStyle={styles.textBut}
        buttonStyle={styles.but}
        containerStyle={{ marginTop: 40 }}
        onPress={this.handleRefresh}
      />
    );
  };

  render() {
    const { data, isRefreshing, isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={styles.general}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      
      <List containerStyle={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListItem
              roundAvatar
              title={item.phone}
              //subtitle={item.startPoint}
              subtitle={item.name}
              avatar={require('./img/phone.png')}
              containerStyle={styles.container}
              onPress={() => {
                  let url = `tel:+7${item.phone}`
                  Linking.openURL(url);
                }
              }
            />
          )}
          keyExtractor = {(item, id) => id.toString ()}
          ItemSeparatorComponent={this.renderSeparator}
          refreshing={isRefreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          ListHeaderComponent={this.renderHeader}
          onEndThreshold={0}
        />
      </List>
    );
  }
}

const styles = StyleSheet.create({
  general: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    
  },

  container: {
    borderTopWidth: 0, 
    borderBottomWidth: 0,
  },

  separator: {
    height: 1,
    width: '86%',
    backgroundColor: '#CED0CE',
    marginLeft: '14%',
  },

  but: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#8BB91C",
    width: "100%",
    height: 65,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5,
  },

  textBut: {
    fontSize: 30,
    fontWeight: "800",
  },

});

export default FlatListTaxi;
