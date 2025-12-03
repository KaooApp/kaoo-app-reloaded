import { useEffect, useState } from 'react';

import { Flex } from 'react-native-flex-layout';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import type { FC } from 'react';

import { setPersonCount } from '@/slices/persisted';
import { useAppDispatch, useAppSelector } from '@/store';

export interface PersonModalProps {
    open: boolean;
    onClose: () => void;
}

const PersonModal: FC<PersonModalProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();

    const personCount = useAppSelector(state => state.persisted.personCount);

    const [adultsCount, setAdultsCount] = useState<string | null>(null);
    const [childrenCount, setChildrenCount] = useState<string | null>(null);

    useEffect(() => {
        if (adultsCount === null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAdultsCount(personCount.adults.toString());
        }
    }, [adultsCount, personCount.adults]);

    useEffect(() => {
        if (childrenCount === null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setChildrenCount(personCount.children.toString());
        }
    }, [childrenCount, personCount.children]);

    const handleConfirm = (): void => {
        if (!adultsCount || !childrenCount) {
            return;
        }

        const adults = parseInt(adultsCount, 10);
        const children = parseInt(childrenCount, 10);

        dispatch(setPersonCount({ adults, children }));
        onClose();
    };

    return (
        <Portal>
            <Dialog visible={open} onDismiss={onClose}>
                <Dialog.Title>Please set the number of people</Dialog.Title>
                <Dialog.Content>
                    <Flex style={{ gap: 8 }}>
                        <TextInput
                            label="Adults"
                            style={{
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                            }}
                            value={adultsCount ?? ''}
                            onChangeText={text => {
                                const parsed = parseInt(text, 10);

                                if (
                                    text.trim() === '' ||
                                    // eslint-disable-next-line no-restricted-globals
                                    (!isNaN(text as never) &&
                                        !Number.isNaN(parsed))
                                ) {
                                    setAdultsCount(text);
                                }
                            }}
                            keyboardType="numeric"
                        />
                        <TextInput
                            label="Children"
                            style={{
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                            }}
                            value={childrenCount ?? ''}
                            keyboardType="numeric"
                            onChangeText={text => {
                                const parsed = parseInt(text, 10);

                                if (
                                    text.trim() === '' ||
                                    // eslint-disable-next-line no-restricted-globals
                                    (!isNaN(text as never) &&
                                        !Number.isNaN(parsed))
                                ) {
                                    setChildrenCount(text);
                                }
                            }}
                        />
                    </Flex>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleConfirm}>Confirm</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default PersonModal;
