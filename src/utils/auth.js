export const logout = (navigate) => {
    console.log('logout called');
    localStorage.clear();
    if (navigate) navigate('/'); // Only redirect if function received navigate
}