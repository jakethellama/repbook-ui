/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,ts}',
    ],
    theme: {
        extend: {
            screens: {
                // phone is 390
                s4p: '400px',
                s5p: '500px', // use this one
                s6p: '600px',
                s7p: '700px',
                s8p: '800px',
                s9p: '900px',
                s10p: '1000px',
                s11p: '1100px',
                s12p: '1200px',
            },
            colors: {
                myRed: '#ff5470', // error & delete
                myBlue: '#4c93ff', // write
                myGreen: '#28c76d', // create
                myPurple: '#785bfd', // navigate
                myOrange: '#ff8d54', // action
                myCyan: '#00dfbe', // action
                myBgPrimary: '#f4f3f2',
                myGray: '#a6a6a6', // placeholder
            },
            borderRadius: {
                xm: '0.25rem',
            },
            outlineWidth: {
                3: '3px',
            },
        },
    },
    plugins: [],
};
