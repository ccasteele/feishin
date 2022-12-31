import { Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { CreatePlaylistQuery } from '/@/renderer/api/types';
import { Button, Switch, TextInput, toast } from '/@/renderer/components';
import { useCreatePlaylist } from '/@/renderer/features/playlists/mutations/create-playlist-mutation';

interface CreatePlaylistFormProps {
  onCancel: () => void;
}

export const CreatePlaylistForm = ({ onCancel }: CreatePlaylistFormProps) => {
  const mutation = useCreatePlaylist();

  const form = useForm<CreatePlaylistQuery>({
    initialValues: {
      comment: '',
      name: '',
      public: false,
      rules: undefined,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    mutation.mutate(
      { query: values },
      {
        onError: (err) => {
          toast.error({ message: err.message, title: 'Error creating playlist' });
        },
        onSuccess: () => {
          toast.success({ message: 'Playlist created successfully' });
          onCancel();
        },
      },
    );
  });

  const isSubmitDisabled = !form.values.name || mutation.isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          data-autofocus
          required
          label="Name"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Description"
          {...form.getInputProps('comment')}
        />
        <Switch
          label="Is Public?"
          {...form.getInputProps('public')}
        />
      </Stack>
      <Group position="right">
        <Button
          variant="subtle"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitDisabled}
          loading={mutation.isLoading}
          type="submit"
          variant="filled"
        >
          Save
        </Button>
      </Group>
    </form>
  );
};
