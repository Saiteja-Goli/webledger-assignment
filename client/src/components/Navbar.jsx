import { Box, Button, Center, Heading, Input, Spinner, Image, useToast } from '@chakra-ui/react'

import React, { useState } from 'react'
import axios from "axios"
import { auth, provider } from './config'
import { signInWithPopup } from 'firebase/auth'

const Navbar = () => {
    const [value, setValue] = useState('')
    const [searchValue, setSearchValue] = useState("")
    const [recipes, setRecipes] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const toast = useToast()

    //Search Functionality
    const handleSearchButton = async () => {
        try {
            setIsLoading(true);
            const searchedValue = { searchValue }
            const data = await axios.post("http://localhost:8000/recipes/search", searchedValue)
            const response = data.data.results
            console.log(response)
            setRecipes(response)
            setIsLoading(false);
        } catch (error) {
            console.error("Error occurred while making the search request:", error);
        }
    }
    //Login With Google
    const handleLogin = () => {
        signInWithPopup(auth, provider)
            .then(data => {
                setValue(data.user)
                console.log(data.user)
                localStorage.setItem("email1", data.user.email)
            })
        console.log(value)
    }
    //Logout
    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    }
    //Adding to Favourites
    const handleFavouriteButton = (recipe) => {
        fetch('http://localhost:8000/favourite/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`, // Include the user's token for authentication
            },
            body: JSON.stringify({ recipe }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                toast({
                    title: 'Added to Fav.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            })
            .catch((err) => {
                console.log(err);
            });

    }
    //Getting data from Favourites
    const handleOpenFavourites = () => {
        fetch('http://localhost:8000/favourite/add', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the user's token for authentication
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setFavorites(data.favorites);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <Box style={navBox}>
                <Box style={innerContainer}>
                    <Box style={innerContainer_Left} >
                        <Input style={searchBar} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        <Button variant='ghost' style={searchButton} onClick={handleSearchButton}>Search</Button>
                    </Box>
                    <Box style={innerContainer_Right}>
                        <Button variant="solid" style={favButton} onClick={handleOpenFavourites}>Favourites</Button>
                        {
                            value ? <>
                                <Button variant='solid' style={loginButton} onClick={handleLogout}>Logout</Button>
                            </>
                                : <Button variant='solid' style={loginButton} onClick={handleLogin}>Login</Button>
                        }
                    </Box>

                    {/* //Google Name and Picture */}
                    <Image src={value.photoURL} width={"30px"} style={{ marginLeft: "-110px", borderRadius: "20px" }} />
                    <p style={{ marginLeft: "-130px", fontWeight: "bold" }}>{value.displayName}</p>
                </Box>
            </Box>
            <Center>
                {
                    isLoading
                        ? (
                            <Spinner size="xl" color="SlateBlue" thickness="4px" emptyColor="gray.200" style={{ margin: "250px auto" }} />
                        )
                        : (
                            <Box style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", width: "90%", }} >
                                {
                                    (recipes && recipes.map((recipe, index) => (
                                        <Box key={index} style={{ padding: "10px 0", borderRadius: "30px 30px 0 0", boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }} >
                                            <Image w={"100%"} src={recipe.image} style={{ borderRadius: "30px 30px 0 0", padding: "-50px" }} />
                                            <Heading size='sm' style={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                width: "30ch",
                                                paddingLeft: "40px"
                                            }}>{recipe.title}</Heading>
                                            <Button variant='solid' style={{ marginLeft: "2px" }} onClick={() => handleFavouriteButton(recipe)}>Add to Fav</Button>
                                        </Box>
                                    )))
                                }
                            </Box>
                        )
                }
            </Center>


        </>
    )
}

// Styles
const navBox = {
    border: "1px solid SlateBlue",
    height: "100px",
    width: "100%",
    backgroundColor: 'SlateBlue'
}
const innerContainer = {
    // border: "1px solid yellow",
    margin: "25px auto",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}
const innerContainer_Left = {
    width: "50%",
    height: "50px"
}
const searchBar = {
    width: "60%",
    height: "50px",
    backgroundColor: "white",
    margin: "0 0 5px 100px",
    borderRadius: "20px 0 0 20px"
}
const searchButton = {
    width: "100px",
    height: "50px",
    backgroundColor: "white",
    margin: "0 0 4px 0",
    borderRadius: "0px 20px 20px 0px"
}
const innerContainer_Right = {
    width: "50%"
}
const favButton = {
    marginRight: "15px",
    height: "50px",
    backgroundColor: "rgb(0,209,113)"
}
const loginButton = {
    marginLeft: "5px",
    backgroundColor: "rgb(0,149,255)",
    height: "50px",
    width: "110px"
}
export default Navbar
