import React, { useState, useEffect } from "react";
import { Container, VStack, Button, Input, List, ListItem, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const Index = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const toast = useToast();

  // Fetch cities from the API
  useEffect(() => {
    fetch("https://sheet.best/api/sheets/05222091-12c2-48e7-8331-51afe0826c68")
      .then((response) => response.json())
      .then((data) => setCities(data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Add a new city
  const addCity = () => {
    const updatedCities = [...cities, { name: newCity }];
    setCities(updatedCities);
    setNewCity("");
    toast({
      title: "City added.",
      description: `${newCity} has been added to your city list.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Delete a city
  const deleteCity = (cityName) => {
    const updatedCities = cities.filter((city) => city.name !== cityName);
    setCities(updatedCities);
    toast({
      title: "City deleted.",
      description: `${cityName} has been removed from your city list.`,
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container centerContent maxW="container.md" padding={4}>
      <VStack spacing={4} width="100%">
        <Input placeholder="Add a new city" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addCity} isDisabled={!newCity}>
          Add City
        </Button>
        <List spacing={3} width="100%">
          {cities.map((city, index) => (
            <ListItem key={index} display="flex" justifyContent="space-between" alignItems="center">
              {city.name}
              <IconButton aria-label="Delete city" icon={<FaTrash />} onClick={() => deleteCity(city.name)} colorScheme="red" />
            </ListItem>
          ))}
        </List>
      </VStack>
    </Container>
  );
};

export default Index;
