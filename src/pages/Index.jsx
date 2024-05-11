import React, { useState, useEffect } from "react";
import { Container, VStack, Button, Input, Grid, Box, Text, IconButton, useToast, Image } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const Index = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const toast = useToast();

  // Fetch cities from the API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("https://sheet.best/api/sheets/05222091-12c2-48e7-8331-51afe0826c68");
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Add a new city
  const addCity = async () => {
    try {
      const response = await fetch("https://sheet.best/api/sheets/05222091-12c2-48e7-8331-51afe0826c68", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCity }),
      });
      if (response.ok) {
        const newCityData = await response.json()[0];
        setCities([...cities, { ...newCityData, img: `https://source.unsplash.com/random/?${newCityData.name}` }]);
        setNewCity("");
        toast({
          title: "City added.",
          description: `${newCity} has been added to your city list.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding city:", error);
    }
  };

  // Delete a city
  const deleteCity = async (cityId) => {
    try {
      const response = await fetch(`https://sheet.best/api/sheets/05222091-12c2-48e7-8331-51afe0826c68/${cityId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedCities = cities.filter((city) => city.id !== cityId);
        setCities(updatedCities);
        toast({
          title: "City deleted.",
          description: "The city has been removed from your city list.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting city:", error);
    }
  };

  return (
    <Container centerContent maxW="container.md" padding={4}>
      <VStack spacing={4} width="100%">
        <Input placeholder="Add a new city" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addCity} isDisabled={!newCity}>
          Add City
        </Button>
        <Grid templateColumns="repeat(3, 1fr)" gap={6} width="100%">
          {cities.map((city, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Image src={`https://source.unsplash.com/random/?${city.name}`} alt={`Image of ${city.name}`} boxSize="200px" objectFit="cover" />
              <Box p={5}>
                <VStack spacing={2}>
                  <Text fontWeight="bold" fontSize="xl">
                    {city.name}
                  </Text>
                  <IconButton aria-label="Delete city" icon={<FaTrash />} onClick={() => deleteCity(city.id)} colorScheme="red" />
                </VStack>
              </Box>
            </Box>
          ))}
        </Grid>
      </VStack>
    </Container>
  );
};

export default Index;
