import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const NameItem = ({ show, show_name, onBlur }) => {
  return show ? (
    <Input defaultValue={show_name} onBlur={onBlur} size="small" />
  ) : (
    <span className="name">{show_name}</span>
  );
};

export const AlbumItemTitle = ({ material_name, editMaterialName, index }) => {
  const [show, setShow] = useState(false);
  function toggle() {
    setShow((pre) => !pre);
  }
  function onBlur(event) {
    const value = event.currentTarget.value;
    if (value === material_name) {
      toggle();
      return;
    }
    editMaterialName(index, value);
    toggle();
  }
  return (
    <>
      <NameItem show={show} show_name={material_name} onBlur={onBlur} />
      {!show && <EditOutlined onClick={toggle} />}
    </>
  );
};

export const PreviewSingleItems = ({ item, changeItem, fatherIndex }) => {
  const { children } = item;

  function changeChild(i, newChild) {
    // newChild传null进来，就能当做删除用了
    let newItem = { ...item };
    newItem.children[i] = newChild;
    newItem.children = newItem.children.filter((child) => child);
    if (newItem.children.length === 0) {
      newItem = null;
    }
    changeItem(fatherIndex, newItem);
  }

  return (
    <>
      {children.map((child, i) => {
        return (
          <div className="box" key={i} style={{ backgroundColor: child.color }}>
            <div className="t1">
              原名：{child.name}，{child.colorText}
            </div>
            <div className="t2">新名：{child.show_name}</div>
            <div className="delbtn">
              <DeleteOutlined
                style={{ fontSize: "20px" }}
                onClick={() => {
                  changeChild(i, null);
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};
