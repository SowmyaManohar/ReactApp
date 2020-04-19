/*********************************************************************************
 * Action: Tasks  
 * Author: Henry Ng - 03/20/20
 ********************************************************************************/
import axios from 'axios'
import * as types from '../constants/task'
import { ENDPOINTS } from '../utils/URL'



export const addNewTask = (newTask, wbsId) => {
  const url = ENDPOINTS.TASK(wbsId);
  return async dispatch => {
    let status = 200;
    let _id = null;
    let task = {};

    try {
      const res = await axios.post(url, newTask)
      _id = res.data._id;
      status = res.status;
      task = res.data;

    } catch (err) {
      console.log("TRY CATCH ERR", err);
      status = 400;
    }

    newTask._id = _id;

    await dispatch(
      postNewTask(task,
        status
      ));

  }

}


export const fetchAllTasks = (wbsId) => {
  const request = axios.get(ENDPOINTS.TASKS(wbsId));
  return async dispatch => {
    await dispatch(setTasksStart());
    request.then(res => {
      dispatch(setTasks(res.data));
    }).catch((err) => {
      dispatch(setTasksError(err));
    })
  }
}

/**
* Set a flag that fetching Task  
*/
export const setTasksStart = () => {
  return {
    type: types.FETCH_TASKS_START,
  }
}


/**
 * set Task in store 
 * @param payload : Task [] 
 */
export const setTasks = (taskItems) => {
  return {
    type: types.RECEIVE_TASKS,
    taskItems
  }
}

/**
 * Error when setting project 
 * @param payload : error status code 
 */
export const setTasksError = (err) => {
  return {
    type: types.FETCH_TASKS_ERROR,
    err
  }
}


export const postNewTask = (newTask, status) => {
  console.log(newTask);
  return {
    type: types.ADD_NEW_TASK,
    newTask,
    status
  }
}




