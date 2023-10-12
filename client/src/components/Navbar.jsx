import { useNavigate } from 'react-router-dom';
import { Box, Button, useToast, Center, HStack, Input, Image, Heading } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { auth, provider } from './Auth/config';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';

const Navbar = () => {
  const token = localStorage.getItem('recipe-token') ? JSON.parse(localStorage.getItem('recipe-token')) : '';
  const [user, setUser] = useState({
    email: '',
    displayName: '',
  });
  const [searchValue, setSearchValue] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const toast = useToast();
  const navigate = useNavigate();

  const initialIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  useEffect(() => {
    // Load user data from local storage when the component mounts
    const userData = JSON.parse(localStorage.getItem('recipe-token'))
    setUser(userData || { email: '', displayName: '' });
  }, []);

  //Home
  const handleHome = () => {
    window.location.reload()
  };

  //Login
  const handleLogin = () => {
    if (!isLoggedIn) {
      signInWithPopup(auth, provider)
        .then(data => {
          localStorage.setItem('recipe-token', JSON.stringify(data.user));
          const body = {
            email: data.user.email,
            displayName: data.user.displayName,
            photoURL: data.user.photoURL,
          };
          axios
            .post('https://webledger-saiteja-goli.vercel.app/users', body)
            .then(response => {
              localStorage.setItem('recipe-token', JSON.stringify(response.data));
              setUser(response.data.data);
              toast({
                title: 'Success',
                description: 'Login Successful',
                status: 'success',
                duration: 4000,
                isClosable: true,
              });
              setIsLoggedIn(true); // Set isLoggedIn to true
              localStorage.setItem('isLoggedIn', 'true');
              navigate('/');
              window.location.reload()
            })
            .catch(error => {
              console.error('Error:', error);
            });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      localStorage.removeItem('recipe-token');
      setUser({ email: '', displayName: '' });
      setIsLoggedIn(false); // Set isLoggedIn to false
      localStorage.removeItem('isLoggedIn');
      window.location.reload();
      toast({
        title: 'Message',
        description: 'Logout Successfully',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    }
  };


  //Search
  const handleSearchButton = async () => {
    try {
      const searchedValue = { searchValue };
      const data = await axios.post("https://webledger-saiteja-goli.vercel.app/recipes/search", searchedValue);
      const response = data.data.results;
      console.log(response);
      setSearchResults(response);
      setSearchValue('')
    } catch (error) {
      console.error("Error occurred while making the search request:", error);
    }
  };

  //Add to Favourites
  const handleAddToFavorites = (recipe) => {
    console.log('Adding Fav From Home from Recipes');
    fetch('https://webledger-saiteja-goli.vercel.app/favourites/add', {
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

  return (
    <>
      <Box position="fixed" top="0" left="0" right="0" zIndex="sticky" pb="30px" bg="silver">
        <Center pt='30px'>
          <Button size="lg" colorScheme={"teal"} mr="40px" onClick={handleHome}>Home</Button>
          <HStack w="80%">
            <Input borderColor={"blue.400"} color='black' placeholder="Search recipe" size="lg" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <Button w="20%" size="lg" colorScheme="blue" onClick={handleSearchButton}>
              Search
            </Button>
            <HStack pl="250px">
              <>
                <Button size="lg" colorScheme="green" onClick={handleLogin}>
                  {isLoggedIn ? "Logout" : "Login"}
                </Button>
                <Image ml="20px" src={user.photoURL} width={"30px"} />
                <p>{user.displayName}</p>
              </>
            </HStack>
          </HStack>
        </Center>

      </Box>
      <Center>
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', width: '90%', marginTop: '10px' }}>
          {searchResults.map((recipe, index) => (
            <Box key={index} style={{ padding: '10px 0', borderRadius: '30px 30px 0 0', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }}>
              <Image w="100%" src={recipe.image} style={{ borderRadius: '30px 30px 0 0' }} />
              <Heading size="sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '30ch', paddingLeft: '40px' }}>{recipe.title}</Heading>
              <Button variant="solid" style={{ marginLeft: '2px' }} onClick={() => handleAddToFavorites(recipe)}>Add to Fav</Button>
            </Box>
          ))}
        </Box>
      </Center>
    </>
  );
};

export default Navbar;
