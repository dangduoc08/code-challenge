import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Item {
  id: number;
  title: string;
  scores: string;
}

interface ErrorResp {
  field: string;
  error: string;
}

const API_URL = "http://localhost:3001/v1/resources";
const PAGE_SIZE = 10;

const App: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData(PAGE_SIZE, 0);
  }, []);

  const fetchData = async (limit: number, offset: number) => {
    const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.data) {
      setData(result.data);
    }

    if (result.total) {
      setTotal(result.total);
    }
  };

  const deleteData = async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result?.data?.affected) {
      return true;
    }

    return false;
  };

  const paginate = (nextPage: number, pageSize: number) => {
    const newOffset = (nextPage - 1) * pageSize;
    setOffset(newOffset);
    fetchData(pageSize, newOffset);
  };

  const showModal = (item?: Item) => {
    setEditingItem(item || null);
    form.setFieldsValue(item || { title: "", scores: "" });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    const isDeleted = await deleteData(id);
    if (isDeleted) {
      setData((prevData) => {
        let clonePrevData = [...prevData];

        clonePrevData = clonePrevData.filter((prevData) => prevData.id !== id);

        return clonePrevData;
      });

      message.error("Deleted successfully!");
    } else {
      message.error("Deleted failure!");
    }
  };

  const handleSubmit = () => {
    let url = API_URL;
    let method = "POST";
    if (editingItem) {
      url += `/${editingItem.id}`;
      method = "PUT";
    }

    form.validateFields().then(async (values) => {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.errors) {
        const errorFields = result.errors.map((error: ErrorResp) => ({
          name: error.field,
          errors: [error.error],
        }));

        form.setFields(errorFields);
      } else {
        setData((prevData) => {
          const clonePrevData = [...prevData];

          if (editingItem) {
            const matchedIndex = clonePrevData.findIndex(
              (prevData) => prevData.id === editingItem.id
            );
            if (matchedIndex >= 0) {
              clonePrevData[matchedIndex] = result.data;
            }
          } else {
            clonePrevData.push(result.data);
          }

          return clonePrevData;
        });
        setModalVisible(false);
      }
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Scores", dataIndex: "scores", key: "scores" },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Item) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        Add Item
      </Button>

      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          pageSize: PAGE_SIZE,
          total,
          current: offset / PAGE_SIZE + 1,
          onChange: paginate,
        }}
        rowKey="id"
      />

      <Modal
        title={editingItem ? "Edit Item" : "Add Item"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Scores" name="scores">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
