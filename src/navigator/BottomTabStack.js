/* eslint-disable react/react-in-jsx-scope */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import course from '../screens/course/course';
import home from '../screens/dashboard/home';
import chating from '../screens/chat/chating';
import settings from '../screens/settings/settings';
import CustomBottomStack from './CustomBottomStack';
import newhome from '../screens/home/newhome';

const Tab = createBottomTabNavigator();

export default function BottomTabStack() {
  return (
    <Tab.Navigator tabBar={props => <CustomBottomStack {...props} />}>
      <Tab.Screen
        name="newhome"
        component={newhome}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="course"
        component={course}
        options={{headerShown: false}}
      />
      <Tab.Screen name="home" component={home} options={{headerShown: false}} />
      <Tab.Screen
        name="chating"
        component={chating}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="settings"
        component={settings}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
