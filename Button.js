'use strict';

const React = require('react');
const {
  PropTypes
} = React;

const {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  TouchableNativeFeedback,
  Platform
} = require('react-native');

const isEqual = require('lodash.isequal');

const Button = React.createClass({
  propTypes: Object.assign({},
    {
      textStyle: Text.propTypes.style,
      disabledStyle: Text.propTypes.style,
      children: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.node,
        React.PropTypes.element
      ]),
      activeOpacity: PropTypes.number,
      allowFontScaling: PropTypes.bool,
      isLoading: PropTypes.bool,
      isDisabled: PropTypes.bool,
      activityIndicatorColor: PropTypes.string,
      onPress: PropTypes.func,
      onLongPress: PropTypes.func,
      onPressIn: PropTypes.func,
      onPressOut: PropTypes.func,
      background: (TouchableNativeFeedback.propTypes) ? TouchableNativeFeedback.propTypes.background : PropTypes.any,
    },
  ),

  statics: {
    isAndroid: (Platform.OS === 'android'),
  },

  _renderChildren: function(isIOS) {
    var childElements = [];
      React.Children.forEach(this.props.children, (item) => {
        if (typeof item === 'string') {
          var element;
          if (isIOS) {
            element = (
              <Text key={item} style={[styles.textButton, this.props.textStyle]} allowFontScaling={this.props.allowFontScaling}>
                {item}
              </Text>
            );
          } else {
            var element = (
              <Text key={item} style={[styles.textButton, this.props.textStyle]}>
                {item}
              </Text>
            );
          }
          childElements.push(element);
        } else if (React.isValidElement(item)) {
          childElements.push(item);
        }
      });
    return (childElements);
  },

  _renderInnerTextAndroid: function () {
    if (this.props.isLoading) {
      return (
        <ProgressBarAndroid
          style={[{
            height: 20,
          }, styles.spinner]}
          styleAttr='Inverse'
          color={this.props.activityIndicatorColor || 'black'}
        />
      );
    }
    return this._renderChildren(false);
  },

  _renderInnerTextiOS: function () {
    if (this.props.isLoading) {
      return (
        <ActivityIndicatorIOS
          animating={true}
          size='small'
          style={styles.spinner}
          color={this.props.activityIndicatorColor || 'black'}
        />
      );
    }
    return this._renderChildren(true);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    if (!isEqual(nextProps, this.props)) {
      return true;
    }
    return false;
  },

  _renderInnerText: function () {
    if (Button.isAndroid) {
      return this._renderInnerTextAndroid()
    }
    return this._renderInnerTextiOS()
  },

  render: function () {
    if (this.props.isDisabled === true || this.props.isLoading === true) {
      return (
        <View style={[styles.button, this.props.style, (this.props.disabledStyle || styles.opacity)]}>
          {this._renderInnerText()}
        </View>
      );
    } else {
      // Extract Touchable props
      let touchableProps = {
        onPress: this.props.onPress,
        onPressIn: this.props.onPressIn,
        onPressOut: this.props.onPressOut,
        onLongPress: this.props.onLongPress,
        activeOpacity: this.props.activeOpacity,
      };
      if (Button.isAndroid) {
        touchableProps = Object.assign(touchableProps, {
          background: this.props.background || TouchableNativeFeedback.SelectableBackground()
        });
        return (
          <TouchableNativeFeedback {...touchableProps}>
            <Text style={[styles.button, this.props.style]}>
              {this._renderInnerTextAndroid()}
            </Text>
          </TouchableNativeFeedback>
        )
      } else {
        return (
          <TouchableOpacity {...touchableProps}
            style={[styles.button, this.props.style]}>
            {this._renderInnerTextiOS()}
          </TouchableOpacity>
        );
      }
    }
  }
});

const styles = StyleSheet.create({
  button: {
    height: 44,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  textButton: {
    fontSize: 18,
    alignSelf: 'center',
  },
  spinner: {
    alignSelf: 'center',
  },
  opacity: {
    opacity: 0.5,
  },
});

module.exports = Button;
