import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, Center, Heading, Image, Spinner, HStack, VStack, Text } from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    useDisclosure, useToast,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

const Recipes = () => {
    const [recipes, setRecipes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [recipeDetails, setRecipeDetails] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()


    //Fetching the Data
    const fetchData = async () => {
        try {
            setIsLoading(true)
            const data = await axios.get("http://localhost:8000/recipes")
            const response = data.data.recipes
            console.log(response)
            setRecipes(response)
            setIsLoading(false)
        } catch (error) {
            console.error("Error occurred while making the Fetch request:", error);
        }


    }
    useEffect(() => {
        fetchData();
    }, [])

    const handleDetailsButton = (recipe) => {
        console.log(recipe)
        setRecipeDetails(recipe);
        onOpen();
    }

    const handleAddToFavorites = (recipe) => {
        fetch('https://easy-pink-walkingstick-tam.cyclic.cloud/fav/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include the user's token for authentication
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
    return (
        <div>
            <Center>
                {
                    isLoading ? (<Spinner size="xl" color="SlateBlue" thickness="4px" emptyColor="gray.200" style={{ margin: "250px auto" }} />)
                        : (<Box style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", width: "90%", }} >
                            {
                                recipes && recipes.map((recipe, index) => (
                                    <Box key={index} style={{ padding: "10px 0", borderRadius: "30px 30px 0 0", boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }} >

                                        <Image w={"100%"} src={recipe.image} style={{ borderRadius: "30px 30px 0 0", padding: "-50px" }} />
                                        <Heading size='sm' style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "30ch",
                                            paddingLeft: "40px"
                                        }}>{recipe.title}</Heading>
                                        <Button variant='solid' style={{ marginRight: "2px" }} onClick={() => handleDetailsButton(recipe, index)}>Details</Button>
                                        <Button variant='solid' style={{ marginLeft: "2px" }} onClick={() => handleAddToFavorites(recipe, index)}>Add to Fav</Button>
                                    </Box>
                                ))
                            }
                        </Box>)
                }

            </Center>
            //TOAST
            {
                recipeDetails && (
                    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size={"3xl"}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader><Heading>{recipeDetails.title}</Heading></ModalHeader>
                            <ModalCloseButton />


                            <ModalBody>
                                <VStack alignItems={"flex-start"}>
                                    <Image w={"100%"} h={"400px"} src={recipeDetails.image} />
                                    <VStack>
                                        <Heading size={'md'}>Summary</Heading>
                                        <Text>{recipeDetails.summary}</Text>
                                    </VStack>
                                </VStack>
                            </ModalBody>


                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                    Close
                                </Button>
                                <Button variant='ghost'>Add to Fav</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }
        </div >
    )
}

export default Recipes
