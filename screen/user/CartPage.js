import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView, RefreshControl } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { API_URL } from "../constantAPI";

const CartPage = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [refreshing, setRefresh] = useState(false);
  const currentTime = new Date();
  const seconds = currentTime.getSeconds();
  const {successCart} = route.params || {};

  const getDataHistory = async () => {
    const token = await AsyncStorage.getItem("token");
    
    const response = await axios.get(`${API_URL}history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response.data", response.data);
    setData(response.data);
  };

  const cancelCart = async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${API_URL}keranjang/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Alert.alert("Cancel Success");
    getDataHistory();
  };

  const payProduct = async () => {
    const token = await AsyncStorage.getItem("token");
     await axios.put(`${API_URL}pay-product`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Alert.alert("Successfully payment")
    getDataHistory();
    navigation.navigate('MainUser', {getDataSiswaCallBack: seconds})
  }

  useEffect(() => {
    getDataHistory();
    if (successCart === successCart ||successCart !== successCart ) {
      getDataHistory();
    }
  }, [successCart]);

  const onRefresh = async () => {
    setRefresh(true);
    await getDataHistory();
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaView className="bg-white w-full h-full">
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View className=" w-full p-3 py-4 border-b border-slate-300 flex flex-row justify-between items-center bg-white ">
          <View className="pt-6">
            <Text className="font-bold text-lg">Fintech</Text>
          </View>
          
        </View>
        <View className="py-0 p-3">
          <View className="bg-slate-900 p-4 rounded-lg flex flex-row justify-between items-center">
            <View>
              <Text className="text-white font-bold text-lg">Total</Text>
              <Text className="text-white text-base">Rp{data.totalPrice}</Text>
            </View>
            <View>
              {data.totalPrice > data.difference ? (
                <Text>
                Your balance is low, your balance: {data.difference}</Text>
              ) : (
                <TouchableOpacity
                  className="bg-white py-2 rounded-full px-6"
                  onPress={payProduct}
                >
                  <Text className="text-black font-bold">Buy</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View className="py-0 flex p-3 justify-between">
          <View>
            <Text className="font-bold text-lg mb-2">
              Your Cart {data.keranjanglength} result
            </Text>
          </View>
          {data.transactionsKeranjang?.map((item, index) => (
            <View
              key={index}
              className="flex flex-row justify-between items-center border border-slate-200 rounded-lg p-3 mb-3"
            >
              <View className="flex flex-row gap-3 items-center">
                <View className="p-1.5 px-3 rounded-lg` border border-slate-200 ">
                  <Text className="text-lg">{item.quantity}x</Text>
                </View>
                <View>
                  <Text className="text-base  text-black">
                    {item.products.name}
                  </Text>
                  <Text className="text-lg text-green-600 font-bold">
                    Rp{item.price}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="bg-slate-900 p-2 rounded-lg"
                onPress={() => cancelCart(item.id)}
              >
                <MaterialCommunityIcons name="delete" color="white" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default CartPage;
