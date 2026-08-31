import TaskRow from "./TaskRow";
import "./TasksList.css";

function TasksList({ tasks = [] }) {
  return (
    <div className="dash-card tk-list" role="table" aria-label="Tasks">
      <div className="tk-th" role="row" aria-hidden="true">
        <span />
        <span>Task</span>
        <span>Project</span>
        <span>Assignee</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Due</span>
        <span />
      </div>

      <div>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TasksList;