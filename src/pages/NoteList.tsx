import { FC, useMemo, useState } from 'react';

import { Button, Col, Form, Input, Row, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';

import EditTagsModal from '../components/EditTagsModal';
import NoteCard from './../components/NoteCard';

import type { ISimpleNote } from '../types/note';
import type { ITag } from '../types/tag';

interface NoteListProps {
  notes: ISimpleNote[];
  availableTags: ITag[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
}

const NoteList: FC<NoteListProps> = ({
  availableTags,
  notes,
  onDeleteTag,
  onUpdateTag,
}) => {
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<{ title: string }>();
  const title = Form.useWatch('title', form);

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        note =>
          note.title.toLowerCase().includes((title || '').toLowerCase()) &&
          selectedTags.every(tag =>
            note.tags.some(noteTag => noteTag.id === tag.id)
          )
      ),
    [title, selectedTags, notes]
  );

  return (
    <section className="mx-3 md:mx-48 md:w-full">
      <Row
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
        className="mb-4 flex items-center justify-between"
        wrap
      >
        <Col sm={10} md={8} lg={5} xl={13}>
          <Typography.Title level={2}>Notes</Typography.Title>
        </Col>
        <Col md={8} lg={9} xl={8}>
          <Space>
            <Link to="/new-note">
              <Button type="primary">Create</Button>
            </Link>
            <Button onClick={() => setIsModalOpen(true)}>Edit Tags</Button>
          </Space>
        </Col>
      </Row>

      <Form requiredMark={false} colon={false} form={form}>
        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} className="mb-4">
          <Col>
            <Form.Item label="Title" name="title">
              <Input className="h-[38px] w-80" size="large" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="Tags" name="tags">
              <ReactSelect
                className="w-80"
                isMulti
                options={availableTags.map(tag => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                value={selectedTags?.map(tag => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                onChange={tags => {
                  setSelectedTags(
                    tags.map(tag => ({
                      label: tag.label,
                      id: tag.value,
                    }))
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 34 }]}
        className="flex-col md:flex-row"
      >
        {filteredNotes.map(note => (
          <Col xs={8} lg={6} xl={5} key={note.id}>
            <NoteCard note={note} />
          </Col>
        ))}
      </Row>
      <EditTagsModal
        onDeleteTag={onDeleteTag}
        onUpdateTag={onUpdateTag}
        availableTags={availableTags}
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default NoteList;
