import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { db } from '../firebase';
import { collection, getDocs, getDoc, doc, query, where } from "firebase/firestore";
import withAuthentication from "../withAuthentication";
import { Context } from "../Context";

// components
import Loading from "../components/Loading";

// UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MenuItem, TextField, } from "@mui/material"

// import { Tooltip } from 'react-tooltip';

function General() {
    const { userState, loading } = useContext(Context);
    const { program, tenantId, role } = userState;
    const [selectedProgram, setSelectedProgram] = useState(program);
    const [programsData, setProgramsData] = useState([]);
    const [allProgramsDropdown, setAllProgramsDropdown] = useState([]);
    const navigate = useNavigate();

    // console.log(userState, 'userState')

    // fetch programs from firestore
    useEffect(() => {
        if (loading || !tenantId || !role || !userState.program) return;
        // if teacher/admin/superAdmin fetch all programs, if student fetch only the student's program:

        if (role === 'user' || role ==='teacher') {
            let userProgram = program;
            if (!userProgram) return;
            // if prgram is an array, get the first program
            if (Array.isArray(userProgram)) {
                userProgram = userProgram[0];
                // console.log(userProgram, 'userProgram')
            }

            const fetchProgram = async () => {
                // const programRef = doc(db, 'tenants', tenantId, 'programs', userProgram);
                const programQuery = query(collection(db, 'tenants', tenantId, 'programs'), where('name', '==', userProgram));
                try {
                    const querySnapshot = await getDocs(programQuery);
                    if (!querySnapshot.docs.length) {
                        console.log('Document not found', userProgram);
                        return
                    }

                    querySnapshot.forEach((doc) => {
                        const programData = doc.data();
                        const programInfo = {
                            uid: doc.id,
                            ...programData
                        };
                        // Set the program data in your state
                        setProgramsData(programInfo);
                        setSelectedProgram(programInfo);
                    });
                } catch (err) {
                    console.error("Error fetching program data:", err);
                }
            };
            fetchProgram();
            return;
        }
        if (role === 'admin' || role === 'superAdmin') {
            const fetchAllPrograms = async () => {
                const programsRef = collection(db, 'tenants', tenantId, 'programs');
                try {
                    const programSnapshot = await getDocs(programsRef);
                    if (programSnapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    const programs = programSnapshot.docs.map(doc => {
                        const programData = doc.data();
                        return {
                            uid: doc.id,
                            ...programData
                        };
                    });
                    setProgramsData(programs);
                    setSelectedProgram(programs[0]);
                } catch (err) {
                    console.error("Error fetching programs data:", err);
                }
            };
            fetchAllPrograms();
        }
        
    }, [loading, tenantId, role, program, userState.program]);

    // set all programs to a dropdown:
    useEffect(() => {
        if (loading || !programsData || !programsData || role === 'user') return;
        // check if programsData is an array, if not, exit
        if (!Array.isArray(programsData) || programsData.length === 1) return;
        const allProgramsDropdown = programsData.map((program, index) => {
            return (
                <MenuItem key={index} value={program.name}>
                    {program.name}
                </MenuItem>
            );
        });
        setAllProgramsDropdown(allProgramsDropdown);

    }, [loading, programsData, role]);

    // console.log(programsData, 'programsData')
    // console.log(allProgramsDropdown, 'allProgramsDropdown')
    // console.log(selectedProgram, 'selectedProgram')

    if (loading) return <Loading />
    return (
        <div className='page-container' data-testid='general-1'>
            <div className='page-title'>
                <h3 >Informatie over {program}</h3>
                <h5>Algemene informatie over je programma en de meest gestelde vragen</h5>
            </div>
            <div className='page-content'>
                <div>
                    {/* {((role && role === 'admin') || (role && role === 'teacher') || (role && role === 'superAdmin')) && program.length>1  ?
                        <TextField
                            value={selectedProgram.name || ''}
                            label="Change program"
                            data-testid='general-2'
                            style={{ width: '30%', marginTop: '15px' }}
                            select
                            onChange={(e) => {
                                const programData = programsData.find(program => program.name === e.target.value);
                                setSelectedProgram(programData);
                            }}
                        >
                            {allProgramsDropdown}
                        </TextField>
                        : ''} */}
                    {((role && role === 'admin') || (role && role === 'teacher') || (role && role === 'superAdmin')) && !selectedProgram.generalPage ?
                        <div style={{ marginTop: '20px', height: '200px' }} className="element-body">
                            <h6>Please add content to your program in order for it to show up here.</h6>
                        </div>
                        : ''
                    }
                </div>
                <div className="general-box-row">
                    <div className="general-box-col">
                        <div className="element-box">
                            {selectedProgram && selectedProgram.generalPage?.content && selectedProgram.generalPage?.content?.map((item, index) => {
                                return (
                                    <div key={index} style={{ marginBottom: '20px' }}>
                                        <div className="element-title-green">
                                            <h5 >{item.title}</h5>
                                        </div>
                                        <div className="text-section element-body">
                                            <p >{item.text}</p>
                                        </div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>
                    <div className="general-box-col col2">
                        <div style={{ gap: '0px' }} className="element-box">
                            {program && selectedProgram && selectedProgram?.generalPage?.questions &&
                                <div className="element-title-green">
                                    <h5>Q&A: uw meest gestelde vragen</h5>
                                </div>
                            }
                            {program && selectedProgram.generalPage?.questions && selectedProgram.generalPage?.questions?.map((item, index) => {
                                return (
                                    <Accordion key={index} sx={{ width: '100%' }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="qaQuestion-content"
                                            id="qaQuestion-header"
                                        >
                                            <Typography style={{ fontWeight: '500' }} > {item.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>{item.answer}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                )
                            }
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="pagination">
                <button className="greyButton" onClick={() => navigate(-1)}>Terug</button>
            </div>
        </div >

    )
}
export default withAuthentication(General);