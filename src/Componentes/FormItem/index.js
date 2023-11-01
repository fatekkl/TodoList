import './FormItem.css'
import {useEffect, useState } from 'react'


const FormItem = () => {
    const [TasksJson , setTasksJson] = useState([]) 

    useEffect(() => {
        getTask()
    }, [])

    async function getTask( ) {
        try {
            const resp = await fetch("http://localhost:3333/todos")
            const data = await resp.json()
            setTasksJson(data)
        } catch (error) {
            throw new Error(error)
        }
     }
    
    const addTask = async () =>  {
        try {
            await fetch('http://localhost:3333/todos', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: "Clique aqui para escrever!",
                    completed: false,
                })
            });
            getTask()
        } catch (error) {
            throw new Error(error);
        }

    }

    const updateTask = async (event) => {
        const alvo = event.target
        await fetch(`http://localhost:3333/todos/${alvo.parentNode.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                description:
                    alvo instanceof HTMLParagraphElement
                        ? alvo.innerText
                        : alvo.nextElementSibling.innerText,
                completed:
                 alvo instanceof HTMLInputElement
                 ? alvo.checked : alvo.previousElementSibling.innerText,
            })
        })
        getTask()
    }


    const TurnEditable = (event) => {
        const text = event.target
        text.setAttribute('contentEditable', 'true')
    }

    const deleteTask = async (event) => {
        const alvo = event.target

        try {
            await fetch(`http://localhost:3333/todos/${alvo.parentNode.id}`, {
                method: 'DELETE',
            });
            getTask()
        } catch (error) {
            throw new Error(error)
        }
        
    }

    return (
    <>
    <div className='button-container'>
        <p>Adicionar tarefa</p>
        <button onClick={addTask} className='button-create'>+</button>
    </div>
    <ul className='item-container'>
        {TasksJson.map((task) => (
        <li className='items-li' id={task.id} key={task.id} >
            <input className='li-checkbox' onClick={updateTask} type="checkbox" checked={task.completed} />
            <p spellCheck='false'onBlur={updateTask} onClick={TurnEditable}>{task.description}</p>
            <button onClick={deleteTask} className='delete-button-'>-</button>
        </li>
        ))}
    </ul>
    
    </>
    )


}

export default FormItem