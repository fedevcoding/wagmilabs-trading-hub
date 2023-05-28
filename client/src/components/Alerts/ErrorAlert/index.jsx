import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

export const ErrorAlert = ({
  title,
  description,
  btnLeftLabel,
  btnRightLabel,
  isOpen,
  cancelRef,
  onClose
}) => (
  <AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={cancelRef}
    onClose={onClose}
  >
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
          {title}
        </AlertDialogHeader>

        <AlertDialogBody>
          {description}
        </AlertDialogBody>

        <AlertDialogFooter>
          {btnLeftLabel && (
            <Button ref={cancelRef} onClick={onClose}>
              {btnLeftLabel}
            </Button>
          )}
          {btnRightLabel && (
            <Button colorScheme='red' onClick={onClose} ml={3}>
              {btnRightLabel}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>
);