import Icon, { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Grid, Input, Row } from "antd";
import { productParkIcon } from "../../assets";
import { useAppDispatch } from "../../hooks/redux";
import { setIsAuth } from "../../store/reducers/SchemeSlice";

export default function Auth() {
  const dispatch = useAppDispatch();
  return (
    <>
      <Flex
        align="center"
        justify="center"
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Col md={5} sm={9} xs={12}>
          <Flex justify="center" style={{ marginBottom: 24 }}>
            <img src={productParkIcon} alt="Объект" />
          </Flex>
          <Form>
            <Form.Item
              name="login"
              rules={[{ required: true, message: "Введите логин" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Логин"
                variant="filled"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input
                prefix={<LockOutlined />}
                placeholder="Пароль"
                variant="filled"
                type="password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                block
                style={{ background: "#20c997", color: "#fff" }}
                onClick={() => {
                  dispatch(setIsAuth(true));
                }}
              >
                Авторизация
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Flex>
    </>
  );
}
