import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    
    // Use 'clients' as the single array holding all client data.
    const clients = this.getClients();
    this.state = {
      // Initialize state with the fetched clients array
      clients: clients.map(client => ({
        ...client,
        // Ensure all clients have a status, defaulting to 'backlog'
        status: client.status || 'backlog'
      })),
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
    // Note: Removed the unnecessary this.updateClientStatus.bind(this)
    // because updateClientStatus is now defined as an arrow function property.
  }

  getClients() {
    // Note: The original data had the status at index [3].
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3], // 'backlog', 'in-progress', or 'complete'
    }));
  }

  // Defined as an arrow function property to automatically bind 'this'
  updateClientStatus = (clientId, newStatus) => {
    this.setState(prevState => {
      // Find and update the status of the single client in the array
      const updatedClients = prevState.clients.map(client => {
        if (client.id === clientId) {
          console.log(`Client ${clientId} status changed to ${newStatus}`);
          // Update the status
          return { ...client, status: newStatus };
        }
        return client;
      });

      // Return the new clients array to the state
      return { clients: updatedClients };
    });
  };


  componentDidMount() {
    // FIX 1: Access the draggable container elements directly via their refs.
    // Since the ref is applied to the <div className="Swimlane-dragColumn"> in Swimlane.js,
    // .current now refers to the actual DOM element we need.
    const backlogLane = this.swimlanes.backlog.current;
    const inProgressLane = this.swimlanes.inProgress.current;
    const completeLane = this.swimlanes.complete.current;

    // Initialize Dragula with the three containers
    const drake = Dragula([backlogLane, inProgressLane, completeLane]);

    drake.on('drop', (el, target, source, sibling) => {
      const newStatus = target.id.replace('-lane', '');
      const clientId = el.getAttribute('data-id');

      // CRITICAL FIX 2: Cancel Dragula's automatic DOM move.
      // This prevents the NotFoundError by allowing React to handle the move 
      // based on the state update.
      drake.cancel(true); 

      // Now update the React state
      this.updateClientStatus(clientId, newStatus);
    });
  }

  renderSwimlane(name, statusKey, ref) {
    // Filter the single client array based on the status for rendering
    const clientsForLane = this.state.clients.filter(client => client.status === statusKey);

    return (
      <Swimlane 
        name={name} 
        status={statusKey} // Pass the status key for ID generation in Swimlane.js
        clients={clientsForLane} 
        dragulaRef={ref} // Pass the ref down to the Swimlane container
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', 'backlog', this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', 'in-progress', this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', 'complete', this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
