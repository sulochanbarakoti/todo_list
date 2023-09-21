import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    loadTodos().then((loadedTodos) => {
      setTodos(loadedTodos);
    });
  }, []);

  // adding task to asyncstorage---------------------------------------------

  const saveTodos = async (todos) => {
    try {
      const jsonTodos = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", jsonTodos);
      // console.log(jsonTodos);
    } catch (error) {
      console.error("Error saving todos", error);
    }
  };

  //------------------------END----------------------------------------------

  // load todos list------------------------------------------------------------
  const loadTodos = async () => {
    try {
      const jsonTodos = await AsyncStorage.getItem("todos");
      return jsonTodos != null ? JSON.parse(jsonTodos) : [];
    } catch (error) {
      console.error("Error loading todos", error);
      return [];
    }
  };

  //-----------------------------END--------------------------------------------

  // delete todos list------------------------------------------------------------

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  //-------------------------------END-----------------------------------------

  // ADD todos list------------------------------------------------------------

  const addTodo = () => {
    if (newTodo.trim() === "") return;
    const newTodoItem = {
      id: todos.length + 1,
      text: newTodo,
      complete: false,
    };

    //-------------------------------END-----------------------------------------

    // UPDATE todos list------------------------------------------------------------

    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setNewTodo("");
  };

  //-------------------------------END-----------------------------------------

  const Item = ({ title, id, complete }) => (
    <View style={styles.listItems}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => isChecked(id)}
          style={styles.checkButton}
        >
          {complete && <Text>X</Text>}
        </TouchableOpacity>
      </View>
      <View style={styles.item}>
        <Text style={[complete ? styles.completeTitle : styles.title]}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => deleteTodo(id)}>
          {/* <Text style={styles.button}>Delete</Text> */}
          <Icon name="trash" size={25}></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );

  // When the list item is marked as completed--------------------------------------

  const isChecked = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id == id) {
        return { ...todo, complete: !todo.complete };
      }
      return todo;
    });
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  //--------------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Todo List</Text>
        <Icon name="heart" color="red" size={20} />
      </View>
      <View style={{ flex: 9 }}>
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <Item title={item.text} id={item.id} complete={item.complete} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TextInput
          style={styles.input}
          placeholder="  Write a note."
          value={newTodo}
          onChangeText={(text) => setNewTodo(text)}
        />
        <TouchableOpacity style={styles.buttonSave} onPress={addTodo}>
          <Text style={{ color: "white" }}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// style -----------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    // alignItems: "center",
    // justifyContent: "center",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    height: "auto",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    marginBottom: 8,
    marginTop: 8,
    width: "15%",
    borderRadius: 7,
  },
  buttonSave: {
    height: 40,
    margin: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    width: "15%",
    borderRadius: 7,
  },
  item: {
    flex: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "skyblue",
    padding: 20,
    marginVertical: 8,
  },
  listItems: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  completeTitle: {
    fontSize: 20,
    color: "red",
    fontWeight: "bold",
  },
  checkButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
