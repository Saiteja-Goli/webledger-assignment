import {
  Box, Button, Center, Heading, Image, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast, VStack
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';


const token = localStorage.getItem('recipe-token') ? JSON.parse(localStorage.getItem('recipe-token')) : '';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [displayFavorites, setDisplayFavorites] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();


  //mounting
  useEffect(() => {
    fetchData();
  }, []);

  // Fetching Recipes
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(' https://webledger-saiteja-goli.vercel.app/recipes/');
      if (response.status === 200) {
        const data = await response.json(); // Parse the JSON response
        setRecipes(data.recipes);
        setIsLoading(false);
      } else {
        toast({
          title: 'Error',
          description: 'Something Went Wrong',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something Went Wrong',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      console.error('Error occurred while making the Fetch request:', error);
    }
  }

  // Details Button
  const handleDetailsButton = (recipe) => {
    console.log(recipe);
    setRecipeDetails(recipe);
    onOpen();
  }

  // Add to Favorites
  const handleAddToFavorites = (recipe) => {
    console.log('Adding Fav From Home from Recipes');
    fetch(' https://webledger-saiteja-goli.vercel.app/favourites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.token}`, // Include the user's token for authentication
      },
      body: JSON.stringify({ title: recipe.title, image: recipe.image }),
    })
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: 'Added to Favorites.',
            description: "Item Added To Favourites Successfully",
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        } else if (res.status === 400) {
          // Recipe already in favorites
          res.json().then((data) => {
            toast({
              title: 'Already in Favorites.',
              description: "This Item Is Already in Favorites",
              status: 'warning',
              duration: 4000,
              isClosable: true,
            });
          });
        } else if (res.status === 401) {
          toast({
            title: 'Not Authorised',
            description: 'Please Login',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Error',
          description: 'An error occurred while adding to favorites.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      });
  };

  // Open Favorites
  const handleOpenFavourites = async () => {
    try {
      const response = await fetch(' https://webledger-saiteja-goli.vercel.app/favourites/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const favoritesData = data.favorites;
        setFavorites(favoritesData); // Set favorites data
        console.log(favorites);
        setDisplayFavorites(true); // Set the flag to display favorites
        // Optionally, clear regular recipes
        setRecipes([]);
      } else if (response.status === 401) {
        toast({
          title: 'Not Authorized',
          description: 'Please Login',
          status: 'warning',
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Error fetching favorites',
          status: 'warning',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error while fetching favorites:', error);
    }
  };

  // Delete From Favorites
  const handleDeleteFromFavourites = (recipe) => {
    // Call your server endpoint to delete the recipe
    fetch(' https://webledger-saiteja-goli.vercel.app/favourites/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: recipe.title, image: recipe.image }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: 'Removed from Favorites.',
            status: 'success',
            duration: 4000,
            isClosable: true,
          });

          // Remove the recipe from the favorites state
          const updatedFavorites = favorites.filter((favRecipe) => favRecipe.title !== recipe.title);
          setFavorites(updatedFavorites);
        } else {
          toast({
            title: 'Error',
            description: 'An error occurred while removing from favorites.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Error',
          description: 'An error occurred while removing from favorites.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      });
  };

  // Conditionally render recipes or favorites
  const renderRecipes = () => {
    if (displayFavorites) {
      return (
        <>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', width: '90%' }}>
            {favorites.length > 0 ? favorites.map((recipe, index) => (
              <Box key={index} style={{ padding: '10px 0', borderRadius: '30px 30px 0 0', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                <Image w="100%" src={recipe.image} style={{ borderRadius: '30px 30px 0 0' }} />
                <Heading size="sm" mt='20px' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '30ch', paddingLeft: '40px' }}>{recipe.title}</Heading>
                <Button variant={'solid'} colorScheme={'red'} m='20px 20px' onClick={() => handleDeleteFromFavourites(recipe)}>Remove From Favourites</Button>
              </Box>
            )) : <Center><Heading>No Favourites</Heading></Center>}
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', width: '90%' }}>
            {recipes.length > 0 ? recipes.map((recipe, index) => (
              <Box key={index} style={{ padding: '10px 0', borderRadius: '30px 30px 0 0', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
                <Image w="100%" src={recipe.image} style={{ borderRadius: '30px 30px 0 0', marginTop: '-10px' }} />
                <Heading size="sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '30ch', paddingLeft: '40px', marginTop: "10px", marginBottom: "10px" }}>{recipe.title}</Heading>
                <Button variant="solid" style={{ marginRight: '2px' }} onClick={() => handleDetailsButton(recipe)}>Details</Button>
                <Button variant="solid" style={{ marginLeft: '2px' }} onClick={() => handleAddToFavorites(recipe)}>Add to Fav</Button>
              </Box>
            )) : <Text size={'lg'}>No Recipes From API</Text>}
          </Box>
        </>
      );
    }
  };


  return (
    <div>
      <Button size="lg" colorScheme={"orange"} mt="100px" ml="970px" mb="20px" onClick={handleOpenFavourites}>Favourites</Button>
      <Center>
        {isLoading ? (
          <Spinner size="xl" color="SlateBlue" thickness="4px" emptyColor="gray.200" style={{ margin: '250px auto' }} />
        ) : (
          renderRecipes()
        )}

        {/* Recipe Details -Model */}
        {recipeDetails && (
          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader><Heading>{recipeDetails.title}</Heading></ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack alignItems="flex-start">
                  <Image w="100%" h="400px" src={recipeDetails.image} />
                  <VStack>
                    <Heading size="md">Summary</Heading>
                    <Text>{recipeDetails.summary}</Text>
                  </VStack>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Center>
    </div>
  );
};

export default Recipes;
