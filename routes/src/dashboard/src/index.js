const getDashboardPage = (req, res) => {
    return res.render("pages/dashboard/dashboard", {
        page: {
            name: "dashboard",
            display: "Kontrol Paneli",
            menu: "dashboard",
            uppermenu: "",
        },
    });
};

module.exports = {
    getDashboardPage,
};
