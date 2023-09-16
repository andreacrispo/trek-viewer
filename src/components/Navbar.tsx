import { Box, Flex, HStack, Heading } from "@chakra-ui/react"

import { ReactComponent as MountainIcon } from './../mountains-icon.svg';

export default function Navbar() {

  return (
    <Flex
      w="100%"
      h={54}
      px="4"
      py="5"
      align="center"
      justify="flex-start"
      className="app-navbar"

    >

      <MountainIcon height={48} />

      <HStack>
        <Heading pl={4}>Trek Viewer</Heading>
      </HStack>

    </Flex>
  )
}