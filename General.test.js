import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import General from '../General';
import { MemoryRouter as Router } from 'react-router-dom';
import { MenuItem, TextField, } from "@mui/material"
import { getDocs } from "firebase/firestore";
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock Firestore
jest.mock("firebase/firestore", () => ({
    ...jest.requireActual("firebase/firestore"),
    getDocs: jest.fn()
}));

const theme = createTheme();

const mockProgramsData = [
    { name: 'program1', /* other data */ },
    { name: 'program2', /* other data */ }
];
// Mock the getDocs call
getDocs.mockResolvedValue({
    docs: mockProgramsData.map(data => ({
        data: () => data,
        id: data.name, // or however the id is determined
        name: data.name
    }))
});

// Create a mock context object with a mock userState and loading value
const mockContext = {
    userState: {
        tenantId: 'tenantId1',
        uid: 'docId1',
        role: 'admin',
        firstName: 'firstName',
        lastName: 'lastName',
        program: 'program1',
        group: 'group1',
        email: 'email@test.com',
        phone: '',
        address: '',
        city: '',
        displayName: 'firstName lastName',
        onboardingProcess: {
            step1: false,
            step2: false,
            step3: false,
        },
        onboardingData: {
            signed: false,
            signedDate: '',
            personalGoal: {
                option1: {
                    answer1: '',
                    answer2: '',
                    answer3: '',
                },
                option2: {
                    answer1: '',
                    answer2: '',
                    answer3: '',
                }
            },
        },
        questionnaires: [],
        quizzes: [],
        videos: [],
        hasChangedPassword: false,
        isSuperAdmin: false,
    },
    loading: false,
};

// Mock useContext to return the mock context object
jest.mock('react', () => ({
    ...jest.requireActual('react'), // use actual for all non-hook parts
    useContext: () => mockContext,
}));

// Mock useNavigate to return a mock function
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
    useNavigate: () => jest.fn(),
}));


describe('General Page', () => {
    test('renders loading component initially', () => {
        render(<General />);
        const loadingElement = screen.getByTestId('general-1');
        expect(loadingElement).toBeInTheDocument();
    });

    // Test Role-Based Conditional Rendering Verify that different elements are rendered based on the user's role (admin, teacher, superAdmin, user)
    // test('renders admin elements', async () => {
    //     mockContext.userState.role = 'admin';
    //     mockContext.userState.program = ['program1', 'program2'];
    //     mockContext.userState.program.length = 2;
    //     render(
    //         <ThemeProvider theme={theme}>
    //             <General />
    //         </ThemeProvider>

    //     );
    //     const adminElement = await screen.findByTestId('general-2');
    //     expect(adminElement).toBeInTheDocument();
    // }
    // );
    // test('renders teacher elements', () => {
    //     mockContext.userState.role = 'teacher';
    //     render(<General />);
    //     const teacherElement = screen.getByTestId('general-2');
    //     expect(teacherElement).toBeInTheDocument();
    // }
    // );
    // test('renders superAdmin elements', () => {
    //     mockContext.userState.role = 'superAdmin';
    //     render(<General />);
    //     const superAdminElement = screen.getByTestId('general-2');
    //     expect(superAdminElement).toBeInTheDocument();
    // }
    // );

    // test('updates selected program on dropdown change', () => {
    //     // render component with multiple programs and role that allows program change
    //     // simulate dropdown change event
    //     // check if setSelectedProgram is called with new program data:
    //     mockContext.userState.role = 'admin';
    //     mockContext.userState.program = ['program1', 'program2'];
    //     render(<General />);
    //     const dropdownElement = screen.getByTestId('general-2');
    //     expect(dropdownElement).toBeInTheDocument();

    // });

    // test('fetches single program', () => {
    //     // render component with single program and role that allows program change
    //     // check if setSelectedProgram is called with new program data:
    //     mockContext.userState.role = 'admin';
    //     mockContext.userState.program = 'program1';
    //     render(<General />);
    //     const dropdownElement = screen.getByTestId('general-2');
    //     expect(dropdownElement).toBeInTheDocument();
    // });

    // test('renders content if present in selected program', () => {
    //     // render component with single program and role that allows program change
    //     // check if setSelectedProgram is called with new program data:
    //     mockContext.userState.role = 'admin';
    //     mockContext.userState.program = 'program1';
    //     render(<General />);
    //     const dropdownElement = screen.getByTestId('general-2');
    //     expect(dropdownElement).toBeInTheDocument();
    // });
    // //    test the onChange function of a TextField component that updates the state based on a user's selection, and then updates the database with the new value
    // test('onchange in dropdown for admin', async () => {
    //     mockContext.userState.role = 'admin';
    //     mockContext.userState.program = ['program1', 'program2'];
    //     // mockContext.userState.program.length = 2;
    //     render(<General />);
    //     const dropdownElement = screen.getByTestId('general-2');
    //     expect(dropdownElement).toBeInTheDocument();
    //     userEvent.selectOptions(dropdownElement, 'program2');

    // }
    // );

});

