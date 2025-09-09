import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const Graph = ({ timeFilter = 'Week' }) => {
  const weekData = [
    { value: 15000, label: 'Mon', frontColor: '#FF7115' },
    { value: 4500, label: 'Tue', frontColor: '#FF7115' },
    { value: 3500, label: 'Wed', frontColor: '#FF7115' },
    { value: 10500, label: 'Thu', frontColor: '#FF7115' },
    { value: 8000, label: 'Fri', frontColor: '#FF7115' },
    { value: 4000, label: 'Sat', frontColor: '#FF7115' },
    { value: 5500, label: 'Sun', frontColor: '#FF7115' },
  ];

  const monthData = [
    { value: 45000, label: 'Jan', frontColor: '#FF7115' },
    { value: 52000, label: 'Feb', frontColor: '#FF7115' },
    { value: 38000, label: 'Mar', frontColor: '#FF7115' },
    { value: 48000, label: 'Apr', frontColor: '#FF7115' },
    { value: 56000, label: 'May', frontColor: '#FF7115' },
    { value: 42000, label: 'Jun', frontColor: '#FF7115' },
    { value: 65000, label: 'Jul', frontColor: '#FF7115' },
    { value: 58000, label: 'Aug', frontColor: '#FF7115' },
    { value: 51000, label: 'Sep', frontColor: '#FF7115' },
    { value: 62000, label: 'Oct', frontColor: '#FF7115' },
    { value: 49000, label: 'Nov', frontColor: '#FF7115' },
    { value: 71000, label: 'Dec', frontColor: '#FF7115' },
  ];

  const barData = timeFilter === 'Week' ? weekData : monthData;
  const maxValue = timeFilter === 'Week' ? 15000 : 75000;
  
  return (
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingTop: 15,
      paddingBottom: 10,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#C3D8E7',
      overflow: 'hidden',
      marginHorizontal: 10,
    }}>
      <BarChart
        data={barData}
        width={300}
        height={150}
        barWidth={9}
        spacing={28}
        roundedTop
        initialSpacing={20}
        noOfSections={4}
        maxValue={maxValue}
        yAxisLabelPrefix="₹"
        yAxisLabelSuffix=""
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: '#87898A', fontSize: 11, fontFamily: 'Poppins-Regular' }}
        xAxisLabelTextStyle={{
          color: '#87898A',
          textAlign: 'center',
          fontSize: 11,
          fontFamily: 'Poppins-Regular'
        }}
        xAxisColor={'#ccc'}
        yAxisColor={'#ccc'}
        scrollable={true}
        yAxisLabelWidth={50}
        showYAxisIndices={false}
        showOrigin={false}
        hideRules={true}
        rulesColor={'#EAEAEA'}
        rulesType='solid'
        rulesThickness={1}
        scrollToEnd
        rulesOpacity={0}
        hideOrigin={false}
        activeOpacity={0.5}
        renderTooltip={() => null}
        customYAxisIndices={[0, 0.167, 0.333, 0.667, 1]}
        
      />
    </View>
  );
};

export default Graph;
