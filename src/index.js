import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Collapse } from "antd";
import { ReactSortable } from "react-sortablejs";
import { mockData, divideList } from "./tool";
import { AlbumItemTitle, PreviewSingleItems } from "./indexTool";

const { Panel } = Collapse;

const Index = () => {
  const [value, setValue] = useState([]);
  const [sortChangeIndex, setSortChangeIndex] = useState(undefined);
  const [changeArr, setChangeArr] = useState([]);
  const changeLength = changeArr.length;
  // const value = [{show_name: '', chidlren: []}]
  const maxLength = 3; // 分组的最大值
  useEffect(() => {
    const newValue = divideList(mockData, maxLength);
    setValue(newValue);
    // setValue(mockData)
  }, []);

  useEffect(() => {
    dealChangeArr();
  }, [changeLength]);

  function dealChangeArr() {
    if (changeLength === 2) {
      exchangeValue(changeArr[0], changeArr[1]);
      setChangeArr([]);
      setSortChangeIndex(undefined);
    }
  }
  function exchangeValue(item1, item2) {
    const newValue = value.concat();
    const [index1, children1] = item1;
    const [index2, children2] = item2;
    newValue[index1].children = children1;
    newValue[index2].children = children2;
    setValue(newValue);
  }
  function changeItem(index, newItem) {
    let newValue = value.concat();
    newValue[index] = newItem;
    newValue = newValue.filter((item) => item);
    setValue(newValue);
  }

  function getEditMaterialItem(index, material_name) {
    const editItem = { ...value[index] };
    editItem.children.forEach((child, i) => {
      child.show_name = `${material_name}-${i + 1}`;
    });
    return editItem;
  }

  function editMaterialName(index, material_name) {
    const editItem = getEditMaterialItem(index, material_name);
    changeItem(index, editItem);
  }

  function setList(newValues, sortableObject, index) {
    // 这里只处理交换之后触发的逻辑，所以很多判断
    if (sortableObject !== null) {
      const editItem = { ...value[index] };
      const len1 = editItem.children.length;
      const len2 = newValues.length;
      const names1 = editItem.children.map((item) => item.show_name).join(",");
      const names2 = newValues.map((item) => item.show_name).join(",");
      if (len1 === len2 && names1 !== names2) {
        const show_name = editItem.show_name;
        const r = newValues.map((item, i) => {
          return { ...item, show_name: `${show_name}-${i + 1}` };
        });
        editItem.children = r;
        changeItem(index, editItem);
        return;
      }
      if (sortChangeIndex !== undefined) {
        if (index !== sortChangeIndex) {
          if (len2 > maxLength) {
            setChangeArr([]);
            setSortChangeIndex(undefined);
            return;
          }
          if (len1 !== len2) {
            const r = newValues.map((item, i) => {
              return { ...item, show_name: `${editItem.show_name}-${i + 1}` };
            });
            const newChangeArr = changeArr.concat();
            const item = [index, r];
            newChangeArr.push(item);
            setChangeArr(newChangeArr);
          }
        }
      }
      setSortChangeIndex(index);
    }
  }
  function preChangeItem(index, newItem) {
    if (newItem !== null) {
      newItem.children.forEach((child, i) => {
        child.show_name = `${value[index].show_name}-${i + 1}`;
      });
    }
    changeItem(index, newItem);
  }

  const openKeys = value.map((item, i) => i);

  return (
    <Collapse
      style={{ width: "550px", display: "block", marginBottom: "10px" }}
      activeKey={openKeys}
    >
      {value.map((item, i) => {
        const { children } = item;
        return (
          <Panel
            header={
              <AlbumItemTitle
                material_name={item.show_name}
                index={i}
                editMaterialName={editMaterialName}
              />
            }
            key={i}
          >
            <ReactSortable
              list={children}
              setList={(newValues, sortableObject) => {
                setList(newValues, sortableObject, i);
              }}
              animation={150}
              group="shared"
              style={{ display: "flex", overflow: "scroll" }}
            >
              <PreviewSingleItems
                item={item}
                fatherIndex={i}
                changeItem={preChangeItem}
              />
            </ReactSortable>
          </Panel>
        );
      })}
    </Collapse>
  );
};

ReactDOM.render(<Index />, document.getElementById("container"));
