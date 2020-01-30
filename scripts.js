const serverHost = "https://upflower.herokuapp.com/api";
let myList = [],
    skillType = "all",
    expSkillType = "",
    mySkills = [],
    experience = [],
    work = [],
    ipApiData = {};

function sendMessage() {
    const e = {
        name: $(".name").val() || "anonymous",
        email: $(".email").val() || "anonym@anonym.co",
        message: $(".message").val(),
        reason: $(".reason").val()
    };
    if (e.message) {
        ipApiData.userMessage = e;
        const a = btoa(JSON.stringify(ipApiData));
        $.ajax({
            type: "POST",
            url: `${serverHost}/ports`,
            data: JSON.stringify({
                payload: a
            }),
            contentType: "application/json; charset=utf-8",
            crossDomain: !0,
            success: () => {
                $(".apiMessage").html("message sent!"), $(".apiMessage").css("color", "green")
            },
            error: (e, a) => {
                $(".apiMessage").html("error occured while sending"), $(".apiMessage").css("color", "red")
            }
        })
    } else $(".apiMessage").html("fill in a message to send"), $(".apiMessage").css("color", "red");
    $(".email").val(""), $(".name").val(""), $(".message").val(""), $(".reason").val("casual")
}

function filtSkills(e) {
    return "all" === e ? mySkills : mySkills.filter(a => a.type.includes(e))
}

function appendSkills(e, a = !1) {
    const s = $(`<div class="${a?"expS":"s"}killsContainer"></div>`);
    e.forEach(e => {
        s.append($(`<div class="skill-pill"><i class="${e.icon?e.icon:`devicon-${e.name.toLowerCase()}-plain`}"></i>${e.name}</div>`))
    }), a ? ($(".expSkillsContainer").remove(), $(".exp-tools").append(s)) : ($(".skillsContainer").remove(), $("#skills").append(s))
}

function filterSkills(e) {
    if (e !== skillType) {
        skillType = e;
        const a = filtSkills(e);
        $(".skillsContainer").animate({
            opacity: .25,
            height: "toggle"
        }, 500, function() {
            appendSkills(a)
        })
    }
}

function expTools(e) {
    e !== expSkillType && (expSkillType = e, appendSkills(filtSkills(e), !0)), $(`#${e}`).modal({
        fadeDuration: 750,
        fadeDelay: .25
    })
}
$.getJSON("https://ipapi.co/json/", e => {
    ipApiData = e;
    $.ajax({
        type: "POST",
        url: `${serverHost}/ports`,
        data: JSON.stringify({
            payload: btoa(JSON.stringify(ipApiData))
        }),
        contentType: "application/json; charset=utf-8",
        crossDomain: !0
    })
}), $.getJSON(`${serverHost}/profile`, e => {
    const a = JSON.parse(atob(e.content));
    mySkills = a.skills, myList = a.headlines, experience = a.experience, work = a.work, $("#traits").text(myList[Math.round(Math.random() * (myList.length - 1))]), appendSkills(mySkills), appendExps(experience), appendWork(work), $(".loading-container").css("display", "none"), $(".container-fluid").css("opacity", 1)
});
let intrVl = setInterval(() => {
    $("#traits").text(myList[Math.round(Math.random() * (myList.length - 1))])
}, 5e3);

function appendExps(e) {
    e && e.length && e.forEach(e => appendExp(e))
}

function appendExp(e) {
    $(".emp-container").append($(`<div onclick="expTools('${e.name.toLowerCase().replace(/\s/g,"")}')" class="emp-tile">\n                            <div class="emp-tile-header">\n                                <div>\n                                    <img height="35" width="35" src="images/${e.icon}" /> ${e.name}</div>\n                                <small>${e.industry}</small>\n                                <p>${e.role}</p>\n                            </div>\n                            <div class="emp-tile-footer">\n                                <div>${e.period}</div>\n                            </div>\n                        </div>`));
    const a = $(`<div id="${e.name.toLowerCase().replace(/\s/g,"")}" class="modal">\n                            <h1>\n                                    <img height="45" width="45" src="images/${e.icon}" /> ${e.name}\n                                    <small>${e.industry}</small>\n                                </h1>\n                            <h4 class="pull-right exp-period">${e.period}</h4>\n                            <h3>${e.role}</h3>\n                            <p>${e.description}</p>\n                            <h4>Main Tech Stack</h4>\n                            <div class="exp-tools"></div>\n                        </div>`),
        s = $("<ul></ul>");
    e.bullets && e.bullets.length && e.bullets.forEach(e => {
        s.append($(`<li>${e}</li>`))
    }), e.projects && e.projects.length && e.projects.forEach(e => {
        const a = $(`<li>${e.name}</li>`),
            n = $("<ul></ul>");
        e.bullets && e.bullets.length && (e.bullets.forEach(e => {
            n.append($(`<li>${e}</li>`))
        }), a.append(n)), s.append(a)
    }), a.append(s), $(".emp-container").append(a)
}

function appendWork(e) {
    if (e && e.length) {
        const a = $(".work-container"),
            s = $("<thead></thead>"),
            n = $("<tr></tr>");
        Object.keys(e[0]).forEach(a => {
            n.append($(`<th>${e[0][a]}</th>`))
        }), s.append(n), a.append(s);
        const i = $("<tbody></tbody>");
        e.forEach((e, a) => {
            if (a > 0) {
                const a = $("<tr></tr>");
                Object.keys(e).forEach(s => {
                    "link" === s && e[s] ? a.append($(`<td><a target='_blank' href='${e[s]}'><i class="glyphicon glyphicon-link"></i></a></td>`)) : a.append($(`<td>${e[s]}</td>`))
                }), i.append(a)
            }
        }), a.append(i)
    }
}
