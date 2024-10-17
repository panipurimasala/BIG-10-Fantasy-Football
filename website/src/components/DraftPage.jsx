import React from "react";

const DraftPage = () => {
    return (
<div className="Draft">
    <div className="Home">
            <form action="" method="get">
                <input id="userquery" name="query" type="text" placeholder="Player Name"/>
                <select name="category"> {/* should this be static or dynamic */}
                    <option value="QB">QB</option>
                    <option value="WR">WR</option>
                    <option value="OLINE">O-LINE</option>
                    <option value="TE">TE</option>
                    <option value="RB">RB</option>\
                    <option value="SFT">SAFETY</option>
                    <option value="WR">D-LINE</option>
                    <option value="LB">LB</option>
                    <option value="CB">CB</option>
                    <option value="SPT">SPECIAL</option>
                </select>
                <input type="submit"/>
            </form>
        </div>
    <div className="market_table">
            <table border="1">
                <tr>
                    <th>QB</th>
                    <th>WR</th>
                    <th>O-LINE</th>
                    <th>TE</th>
                    <th>RB</th>
                    <th>SAFETY</th>
                    <th>D-LINE</th>
                    <th>LB</th>
                    <th>CB</th>
                    <th>SPECIAL TEAM</th>
                </tr>
                <tr>
                </tr>
                <tr>
                </tr>
                <tr>
                </tr>
                <tr>
                </tr>
            </table>
    </div>
</div>
)
}
export default DraftPage;